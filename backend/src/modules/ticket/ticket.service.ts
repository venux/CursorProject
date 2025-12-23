import { Injectable } from "@nestjs/common";

export interface Ticket {
  id: string;
  title: string;
  status: string;
}

@Injectable()
export class TicketService {
  private tickets: Ticket[] = [{ id: "TCK-1001", title: "示例工单", status: "open" }];

  findAll() {
    return this.tickets;
  }
}

