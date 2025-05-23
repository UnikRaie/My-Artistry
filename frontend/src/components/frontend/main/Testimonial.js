import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import {Star,} from "lucide-react"


const Testimonial = () => {
  return (
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto max-w-screen-xl px-4 text-center space-y-12">
            <div className="space-y-4 max-w-2xl mx-auto">
              <Badge
                variant="outline"
                className="px-4 py-1 text-sm font-medium bg-primary/10 border-primary/20 text-primary"
              >
                Success Stories
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Users Say</h2>
              <p className="text-muted-foreground text-lg">
                Real feedback from users who have successfully hired or been hired through MyArtistry.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "John Doe",
                  role: "Event Organizer",
                  quote:
                    "MyArtistry made it so easy to find the perfect Artist for our wedding. The platform is user-friendly and the talent selection is top-notch. We found an amazing jazz quartet that made our special day unforgettable.",
                  avatar: "https://i.imgur.com/1X4n3vT.png",
                },
                {
                  name: "Sarah Miller",
                  role: "Restaurant Owner",
                  quote:
                    "I've used MyArtistry several times to book Artists for our restaurant's weekend events. It's reliable, and the booking process is seamless from start to finish. Our customers love the variety of talent we've been able to bring in.",
                  avatar: "https://i.imgur.com/3Jm1N0r.png",
                },
                {
                  name: "Michael Johnson",
                  role: "Professional Guitarist",
                  quote:
                    "As a Artist, this platform has completely transformed the way I find gigs. The booking process is transparent, payments are always on time, and I've built a solid client base through the platform. It's my go-to solution now.",
                  avatar: "https://i.imgur.com/Hp4yZWj.png",
                },
              ].map((client, index) => (
                <Card
                  key={index}
                  className="text-left shadow-md bg-background border-muted hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader className="flex items-center gap-4 pb-2">
                    <Avatar className="w-12 h-12 border-2 border-primary/10">
                      <AvatarImage src={client.avatar} alt={client.name} />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.role}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <blockquote className="text-muted-foreground text-base leading-relaxed">
                      "{client.quote}"
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
  )
}

export default Testimonial
