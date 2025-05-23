import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Star } from "lucide-react"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animation for elements to fade in
    const timeout = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 -z-10"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto max-w-screen-xl px-4 grid gap-12 lg:grid-cols-2 items-center">
        <div
          className={`space-y-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Badge
            variant="outline"
            className="px-4 py-1 text-sm font-medium bg-primary/10 border-primary/20 text-primary"
          >
            The #1 Platform for Artists
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Discover and Hire the <span className="text-primary">Perfect Artist</span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-xl">
            MyArtistry connects talented Artists with clients looking for the perfect sound. Find the right talent
            for your next event, wedding, or project with ease.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button asChild size="lg" className="w-full sm:w-auto text-base">
              <Link to="/find-artist">
                Hire a Artist <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base">
              <Link to="/login">Become a Artist</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>No subscription fees</span>
            <span className="mx-2">•</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Secure payments</span>
            <span className="mx-2">•</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Verified artists</span>
          </div>
        </div>

        <div
          className={`relative transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-2xl blur-lg -z-10"></div>
          <img
            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3AyazlmcnV0aXdxaXYweDFybmFtNmcyNXJnczJ2OXMzZW1yZGloaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gTKhq4a4T4HQ98K8tC/giphy.gif"
            alt="Artist performing"
            className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3] border border-primary/10"
          />
          <div className="absolute -bottom-6 -right-6 bg-background rounded-lg shadow-lg p-4 flex items-center gap-3 border border-muted">
            <div className="bg-primary/10 rounded-full p-2">
              <Star className="w-5 h-5 text-primary fill-primary" />
            </div>
            <div>
              <p className="font-medium">Trusted by 10,000+ Artists</p>
              <p className="text-sm text-muted-foreground">Join our growing community</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}