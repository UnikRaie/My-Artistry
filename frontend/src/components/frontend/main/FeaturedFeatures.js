// FeaturedFeatures.js
"use client"

import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Shield,
  Star,
  Calendar,
  CreditCard,
  MessageSquare,
  ArrowRight
} from "lucide-react"

export default function FeaturedFeatures() {
  return (
    <section className="py-24 bg-muted/10 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto max-w-screen-xl px-4 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge
            variant="outline"
            className="px-4 py-1 text-sm font-medium bg-primary/10 border-primary/20 text-primary"
          >
            Key Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Streamline Your Artist Hiring Process</h2>
          <p className="text-muted-foreground text-lg">
            Whether you're a Artist or a client, our platform is designed to simplify collaboration and
            communication.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl blur-lg -z-10"></div>
            <img
              src="https://i.imgur.com/vRjO6kF.png"
              alt="Platform Features"
              className="rounded-2xl shadow-lg w-full object-cover aspect-video border border-primary/10"
            />
          </div>

          <div className="space-y-8">
            <Tabs defaultValue="clients" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="clients">For Clients</TabsTrigger>
                <TabsTrigger value="artists">For Artists</TabsTrigger>
              </TabsList>

              <TabsContent value="clients" className="space-y-6">
                {[
                  {
                    icon: <Search className="w-8 h-8 text-primary" />,
                    title: "Easy Artist Discovery",
                    desc: "Find the ideal artist for your event or project with powerful filters and smart search tools.",
                  },
                  {
                    icon: <Shield className="w-8 h-8 text-primary" />,
                    title: "Secure Payments",
                    desc: "Built-in payment protection ensures that both clients and artists are covered throughout the booking process.",
                  },
                  {
                    icon: <Star className="w-8 h-8 text-primary" />,
                    title: "Trusted Reviews",
                    desc: "See feedback from real clients before you book—transparency you can trust for confident decisions.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="bg-primary/10 rounded-full p-3 h-fit">{item.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="artists" className="space-y-6">
                {[
                  {
                    icon: <Calendar className="w-8 h-8 text-primary" />,
                    title: "Booking Management",
                    desc: "Easily manage your schedule, availability, and booking requests all in one place.",
                  },
                  {
                    icon: <CreditCard className="w-8 h-8 text-primary" />,
                    title: "Guaranteed Payments",
                    desc: "Our escrow system ensures you get paid for every gig, with funds released promptly after performance.",
                  },
                  {
                    icon: <MessageSquare className="w-8 h-8 text-primary" />,
                    title: "Client Communication",
                    desc: "Built-in messaging system keeps all your client communications organized and accessible.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="bg-primary/10 rounded-full p-3 h-fit">{item.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>

            <Button asChild size="lg" className="gap-2">
              <Link to="/features">
                Explore All Features <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
