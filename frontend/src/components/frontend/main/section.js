import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowRight, Mail } from "lucide-react"

const faqItems = [
    {
      question: "How do I sign up as a Artist?",
      answer:
        "Creating a artist profile is easy! Click on 'Become a Artist' button, complete your profile with details about your performance style, upload media, and set your availability and rates.",
    },
    {
      question: "How does payment work?",
      answer:
        "We use a secure escrow system. When a client books you, the payment is held safely until the performance is complete. Once confirmed, the funds are released to your account within 2-3 business days.",
    },
    {
      question: "Can I hire multiple Artists at once?",
      answer:
        "You can hire individual Artists or bands. Our platform also allows you to create custom packages by selecting multiple artists for larger events.",
    },
    {
      question: "What if I need to cancel a booking?",
      answer:
        "We understand that circumstances change. Our cancellation policy varies depending on how close to the event date you cancel. Please refer to our Terms of Service for detailed information.",
    },
    {
      question: "How are Artist vetted?",
      answer:
        "All Artists go through a verification process that includes identity verification and review of their performance history. We also have a robust review system that helps maintain quality standards.",
    },
  ]




export default function Section() {
  return (
    <div>
        {/* FAQ Section - New */}
        <section className="py-24 bg-muted/10">
          <div className="container mx-auto max-w-screen-xl px-4 grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="px-4 py-1 text-sm font-medium bg-primary/10 border-primary/20 text-primary"
              >
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-lg">
                Find answers to common questions about using MyArtistry for booking and performing.
              </p>
              <div className="pt-4">
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link to="/support">
                    Visit Help Center <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section - New */}
        <section className="py-24 bg-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent -z-10"></div>
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-3xl -z-10 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 translate-y-1/2"></div>

          <div className="container mx-auto max-w-screen-xl px-4 text-center space-y-8">
            <Badge
              variant="outline"
              className="px-4 py-1 text-sm font-medium bg-primary/10 border-primary/20 text-primary"
            >
              Get Started Today
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
              Ready to Transform Your Artistry Experience?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of artists and clients already using MyArtistry to create unforgettable Artistry experiences.
              Sign up today and discover the difference.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto pt-4">
              <Button asChild size="lg" className="w-full">
                <Link to="/signup">
                  Create Account <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link to="/find-artist">Browse Artists</Link>
              </Button>
            </div>
          </div>
        </section>
    </div>
  )
}
