import { TicketService, Ticket } from "./ticket.service";
export declare class TicketController {
    private readonly ticketService;
    constructor(ticketService: TicketService);
    findAll(): Ticket[];
}
