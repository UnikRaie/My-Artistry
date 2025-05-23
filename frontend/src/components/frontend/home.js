"use client"



import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

import Hero from "@/components/frontend/main/hero"
import HowItWorks from "@/components/frontend/main/HowItWorks"
import FeaturedMusicians from "@/components/frontend/main/musicians"
import FeaturedFeatures from "@/components/frontend/main/FeaturedFeatures"
import Testimonial from "@/components/frontend/main/Testimonial"
import ProfileBenefits from "@/components/frontend/main/ProfileBenefits"
import Section from "@/components/frontend/main/Section"
import Stats from "@/components/frontend/main/Stats"



import Navbar from "./Navbar"
import Footer from "./Footer"

// Counter component for animating numbers


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
        <Hero/>
        <Stats/>
        <HowItWorks/>   
        <ProfileBenefits />
        <FeaturedMusicians />
        <FeaturedFeatures />
        <Testimonial />
        <Section />
      <Footer />
    </div>
  )
}

