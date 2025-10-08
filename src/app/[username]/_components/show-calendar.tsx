"use client";

import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Calendar, MapPin, Ticket } from "lucide-react";

const shows = [
  {
    id: 1,
    date: "FRI, MAR 15",
    venue: "Electric Dreams Festival",
    location: "Miami, FL",
    ticketUrl: "#",
  },
  {
    id: 2,
    date: "SAT, MAR 23",
    venue: "Warehouse 23",
    location: "Brooklyn, NY",
    ticketUrl: "#",
  },
  {
    id: 3,
    date: "FRI, APR 5",
    venue: "Neon Nights",
    location: "Los Angeles, CA",
    ticketUrl: "#",
  },
  {
    id: 4,
    date: "SAT, APR 20",
    venue: "Bass Underground",
    location: "Chicago, IL",
    ticketUrl: "#",
  },
];

export function ShowCalendar() {
  return (
    <section className="my-12 text-center">
      <h1 className="my-6 font-sans text-3xl font-bold tracking-tight text-white text-balance">
        Próximos shows
      </h1>
      <div className="space-y-3">
        {shows.map((show) => (
          <Card
            key={show.id}
            className="border-2 bg-card p-5 transition-colors hover:border-primary"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Calendar className="h-4 w-4" />
                  <span className="font-mono text-sm font-semibold">
                    {show.date}
                  </span>
                </div>
                <h3 className="font-sans text-lg font-bold text-card-foreground">
                  {show.venue}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{show.location}</span>
                </div>
              </div>
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a href={show.ticketUrl}>
                  <Ticket className="mr-2 h-4 w-4" />
                  Comprar ingressos
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
