// musicians.js
"use client"

import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronRight } from "lucide-react"

export default function FeaturedMusicians() {
  // Featured musicians
  const featuredMusicians = [
    {
      name: "Alex Rivera",
      genre: "Jazz",
      image: "/alex.jpg?height=300&width=300",
      rating: 4.9,
      reviews: 124,
    },
    {
      name: "Sarah Chen",
      genre: "Classical",
      image: "/womanguitar.jpg?height=300&width=300",
      rating: 4.8,
      reviews: 98,
    },
    {
      name: "Marcus Johnson",
      genre: "R&B",
      image: "/guitarist.jpg?height=300&width=300",
      rating: 4.7,
      reviews: 156,
    },
    {
      name: "Leila Patel",
      genre: "Pop",
      image: "/magician.png?height=300&width=300",
      rating: 4.9,
      reviews: 87,
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
            Top Talent
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Artists</h2>
          <p className="text-muted-foreground text-lg">
            Discover some of our highest-rated artists ready to make your event special
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMusicians.map((musician, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative aspect-square">
                <img
                  src={musician.image || "/placeholder.svg"}
                  alt={musician.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm">{musician.genre}</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{musician.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{musician.rating}</span>
                    <span className="text-muted-foreground text-sm">({musician.reviews})</span>
                  </div>
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-primary">
                    View Profile <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link to="/find-artist">View All Artists</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}