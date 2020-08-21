import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type stateType = {
  +user: {
    +id: string,
    +token: string,
    +discord: {
      +banned_from_guild: boolean,
      +joined_guild: boolean,
      +profile: {
        +avatar: string,
        +avatarId: string,
        +discriminator: string,
        +email: string,
        +id: string,
        +locale: string,
        +username: string,
      },
      +roles: [{
        +color: string,
        +id: string,
        +name: string
      }]
    },
    +purchases: [{
      +name: string
    }]
  },
  +tasks: [{
    +id: string,
    +store: string,
    +keywords: string,
    +profile: string,
    +size: string,
    +style: string,
    +schedule: Date,
    +status: string,
    +message: string,
    +logs: {
      +type: string,
      +message: string,
      +time: Date,
    },
  }],
  +profiles: [{
    +id: string,
    +name: string,
    +billing: {
      +name: string,
      +email: string,
      +phone: string,
      +first: string,
      +last: string,
      +country: string,
      +state: string,
      +address_1: string,
      +address_2: string,
      +address_3: string,
      +zip: string
    },
    +shipping?: {
      +name: string,
      +email: string,
      +phone: string,
      +first: string,
      +last: string,
      +country: string,
      +state: string,
      +address_1: string,
      +address_2: string,
      +address_3: string,
      +zip: string
    }
    +card: {
      +number: string,
      +month: number,
      +year: number,
      +expiration: string
    }
  }],
  +proxies: [{
    +id: string,
    +ip: string,
    +port: string,
    +user: string,
    +pass: string
  }]
}

export type Action = {
  +type: string,
  +data: any
};

export type GetStore = () => stateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetStore, Action>;
