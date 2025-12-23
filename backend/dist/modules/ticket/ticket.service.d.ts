export interface Ticket {
    id: string;
    title: string;
    status: string;
}
export declare class TicketService {
    private tickets;
    findAll(): Ticket[];
}
