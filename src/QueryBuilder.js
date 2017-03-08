import type {
  AtomicCondition as AtomicConditionType,
  CompositeCondition as CompositeConditionType, CompositeConditionConjunction,
  SimpleQuery,
  CombinedQuery
} from './types';

export class AtomicCondition {

  constructor(attribute: string, operator, value?: any): AtomicConditionType {
    return {
      type: 'atomic',
      attribute,
      operator,
      value
    };
  }
}

export class CompositeConditionBuilder {

  conjunction(conjunction: CompositeConditionConjunction) {
    this.conjunction = conjunction;
  }

  addCondition(condition: AtomicConditionType | CompositeConditionType) {
    this.conditions = (this.conditions || []).concat(condition);
    return this;
  }

  build(): CompositeConditionType {
    return {
      type: 'composite',
      conjunction: this.conjunction,
      conditions: this.conditions
    };
  }
}

export class SimpleQueryBuilder {

  constructor(condition?: AtomicConditionType | CompositeConditionType) {
    condition && this.condition(condition);
    return this;
  }

  condition(condition: AtomicConditionType | CompositeConditionType) {
    this.are = { condition };
    return this;
  }

  build(): SimpleQuery {
    return { type: 'simple', are: this.are };
  }
}


export class CombinedQueryBuilder {

  conjunction(conjunction) {
    this.conjunction = conjunction;
    return this;
  }

  addQuery(query) {
    this.queries = (this.queries || []).concat(query);
    return this;
  }

  build(): CombinedQuery {
    return {
      type: 'combined',
      conjunction: this.conjunction,
      queries: this.queries
    };
  }
}


export default class QueryBuilder {

  constructor(name?: string) {
    this.name = name || '';
    return this;
  }

  name(name: string) {
    this.name = name;
    return this;
  }

  simpleQuery(simpleQueryBuilder: SimpleQueryBuilder): SimpleQuery {
    this.query = simpleQueryBuilder.build();
    return this;
  }

  combinedQuery(combinedQueryBuilder: CombinedQueryBuilder): CombinedQuery {
    this.query = combinedQueryBuilder.build();
    return this;
  }

  build(): Object {
    return {
      name: this.name,
      query: this.query
    };
  }
}
