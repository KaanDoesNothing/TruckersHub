export interface iUserEvents {
    data: any,
    createdAt: Date,
    updatedAt: Date
}

export interface iEventDelivered {
    revenue: number;
    distance: number;
    cargo: string;
    from: {
        city: string;
        company: string;
    }
    to: {
        city: string;
        company: string;
    }
    createdAt: Date,
}

export interface iEventFine {
    reason: string;
    location: string;
    price: number;
    createdAt: Date
}

export interface iEventFuel {
    location: string;
    amount: number;
    price: number;
    createdAt: Date
}

export interface iEventTollgate {
    location: string;
    price: number;
    createdAt: Date
}