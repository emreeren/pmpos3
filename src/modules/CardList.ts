import { List, Map as IMap } from 'immutable';
import { CommitRecord, Commit } from '../models/Commit';
import { CardRecord } from '../models/Card';
import { cardOperations } from './CardOperations/index';
import { ActionRecord } from '../models/Action';
import { makeDeepCommit } from '../models/makers';
import { Suggestion } from './CardOperations/Plugins/SetCardTag/AutoSuggest';
import { CardTypeRecord } from '../models/CardType';

class CardList {

    commits: IMap<string, List<CommitRecord>>;
    cards: IMap<string, CardRecord>;
    cardTypes: IMap<string, CardTypeRecord>;
    cardTypeIndex: IMap<string, List<string>>;

    constructor() {
        this.commits = IMap<string, List<CommitRecord>>();
        this.cards = IMap<string, CardRecord>();
        this.cardTypes = IMap<string, CardTypeRecord>();
    }

    setCardTypes(cardTypes: IMap<string, CardTypeRecord>) {
        this.cardTypes = cardTypes;
    }

    readConcurrencyData(actionType: string, card: CardRecord, actionData: any): any {
        return cardOperations.getConcurrencyData(actionType, card, actionData);
    }

    applyAction(card: CardRecord = new CardRecord(), action: ActionRecord): CardRecord {
        if (cardOperations.canHandle(action)) {
            return cardOperations.reduce(card, action);
        }
        return card;
    }

    canApplyAction(card: CardRecord, action: ActionRecord): boolean {
        return cardOperations.canApplyAction(card, action);
    }

    actionReduce = (card: CardRecord, action: ActionRecord) => {
        return this.applyAction(card, action);
    }

    commitReduce = (card: CardRecord, commit: CommitRecord) => {
        return commit.actions.reduce(this.actionReduce, card);
    }

    addCommits(commits: Commit[]) {
        commits.forEach(x => this.addCommit(x));
        this.cardTypeIndex = this.cards.reduce(
            (r: IMap<string, List<string>>, card) => {
                return r.update(card.typeId, list => {
                    if (!list) {
                        list = List<string>();
                    }
                    return list.push(card.id);
                });
            },
            IMap<string, List<string>>());
    }

    getCards(): IMap<string, CardRecord> {
        return this.cards;
    }

    getCardsByType(typeId: string): List<CardRecord> {
        let index = this.cardTypeIndex.get(typeId);
        if (index) {
            return index.map(id => this.cards.get(id) as CardRecord) || List<CardRecord>();
        }
        return List<CardRecord>();
    }

    getCard(id: string): CardRecord {
        return this.cards.get(id) as CardRecord;
    }

    getCommits(id: string): List<CommitRecord> | undefined {
        return this.commits.get(id);
    }

    getCardSuggestions(ref: string, value: string): Suggestion[] {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        if (inputLength === 0) { return []; }

        let cardType = this.cardTypes.valueSeq()
            .find(x => x.reference === ref) || new CardTypeRecord();

        let result = [] as Suggestion[];
        if (cardType.name) {
            let index = this.cardTypeIndex.get(cardType.id) || List<string>();
            let cards = index.map(id => this.cards.get(id) as CardRecord);
            result = cards
                .map(c => {
                    return { label: c.tags.getIn(['Name', 'value']) };
                })
                .toArray();
        }
        return result;
    }

    private addCommit(commit: Commit) {
        this.commits = this.commits.update(commit.cardId, list => {
            if (!list) { list = List<CommitRecord>(); }
            return list.push(makeDeepCommit(commit));
        });
        this.cards = this.cards.update(commit.cardId, cardRecord => {
            let commits = this.commits.get(commit.cardId) as List<CommitRecord>;
            return commits
                .sort((a, b) => a.time - b.time)
                .reduce(this.commitReduce, new CardRecord());
        });
    }
}

export default new CardList();