
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"

export default function ProfileBenefits() {
  return (
    <div>
    <section className="py-24 bg-muted/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl -z-10 transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto max-w-screen-xl px-4 grid gap-12 lg:grid-cols-2 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="absolute -inset-4 bg-gradient-to-bl from-primary/10 to-transparent rounded-2xl blur-lg -z-10"></div>
          <img
            src="https://i.imgur.com/7B46oG5.png"
            alt="Profile Creation"
            className="rounded-2xl shadow-lg w-full object-cover aspect-[4/3] border border-primary/10"
          />
          <div className="absolute top-4 -left-6 bg-background rounded-lg shadow-lg p-3 flex items-center gap-2 border border-muted">
            <div className="bg-green-100 rounded-full p-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Verified Profile</p>
            </div>
          </div>
        </div>

        <div className="space-y-8 order-1 lg:order-2">
          <Badge
            variant="outline"
            className="px-4 py-1 text-sm font-medium bg-primary/10 border-primary/20 text-primary"
          >
            For Artists
          </Badge>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Build a Standout Profile & Get Gig Offers
          </h2>

          <p className="text-muted-foreground text-lg">
            MyArtistry gives you the tools to showcase your skills, grow your brand, and get discovered by event
            organizers worldwide.
          </p>

          <ul className="space-y-4">
            {[
              "Create a professional profile with videos, photos, and audio samples",
              "Set your own rates and availability for maximum flexibility",
              "Receive booking requests directly from interested clients",
              "Build your reputation with verified reviews and ratings",
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Button asChild size="lg" className="gap-2">
            <Link to="/profile">
              Create Your Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
    </div>
  )
}
