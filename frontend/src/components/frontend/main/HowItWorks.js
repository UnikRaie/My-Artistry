// HowItWorks.js
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Search, CreditCard, Star } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      title: "Create Your Profile",
      description:
        "Sign up and build your Artist profile with videos, photos, and details about your performance style.",
      icon: <Users className="w-10 h-10 text-primary" />,
    },
    {
      title: "Get Discovered",
      description:
        "Clients browse profiles and send booking requests based on their event needs and your availability.",
      icon: <Search className="w-10 h-10 text-primary" />,
    },
    {
      title: "Secure Booking",
      description:
        "Review and accept offers, with payments securely held in escrow until your performance is complete.",
      icon: <CreditCard className="w-10 h-10 text-primary" />,
    },
    {
      title: "Perform & Get Paid",
      description: "Deliver an amazing performance and receive payment directly to your account after the event.",
      icon: <Star className="w-10 h-10 text-primary" />,
    },
  ]

  return (
    <section className="py-24">
      <div className="container mx-auto max-w-screen-xl px-4 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge
            variant="outline"
            className="px-4 py-1 text-sm font-medium bg-primary/10 border-primary/20 text-primary"
          >
            Simple Process
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How MyArtistry Works</h2>
          <p className="text-muted-foreground text-lg">
            Our platform makes it easy to connect artists with clients in just a few simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="border border-muted bg-background/50 hover:shadow-md transition-all duration-300"
            >
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  <span className="text-primary mr-2">{index + 1}.</span> {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
