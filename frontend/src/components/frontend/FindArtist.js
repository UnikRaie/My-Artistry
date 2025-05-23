"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { MapPin, DollarSign, Music, User } from "lucide-react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import nodata from "../../assets/nodata.jpg"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


// Import shadcn components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function FindArtist() {
  const [artists, setArtists] = useState([])
  const [searchParams, setSearchParams] = useState({
    name: "",
    location: "",
    genre: "",
    specialization: "",
    priceFrom: "",
    priceTo: "",
    type: "all",
  })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const token = localStorage.getItem("token")

  const fetchArtists = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      const response = await axios.get(`${BACKEND_URL}/api/search`, {
        params: { ...searchParams, page, limit: 6 },
        headers: headers,
      })
      setArtists(response.data.artists)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Error fetching artists: ", error)
    }
  }

  const NoLoginfetchArtists = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/nologinsearch`, {
        params: { ...searchParams, page, limit: 6 },
      })
      setArtists(response.data.artists)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Error fetching all artists: ", error)
    }
  }

  useEffect(() => {
    if (token) {
      fetchArtists()
    } else {
      NoLoginfetchArtists()
    }
  }, [searchParams, page])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchParams({ ...searchParams, [name]: value })
  }

  const handleRadioChange = (value) => {
    setSearchParams({ ...searchParams, type: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setPage(1) // Reset to first page on new search
    if (token) {
      fetchArtists()
    } else {
      NoLoginfetchArtists()
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sticky Filter Section */}
          <div className="md:w-72 md:sticky md:top-20 md:self-start">
            <h2 className="text-xl font-bold mb-6">Find Artists</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Search by name"
                  name="name"
                  value={searchParams.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Search by location"
                  name="location"
                  value={searchParams.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  placeholder="Search by genre"
                  name="genre"
                  value={searchParams.genre}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  placeholder="Search by specialization"
                  name="specialization"
                  value={searchParams.specialization}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price Range</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="priceFrom"
                    placeholder="From"
                    name="priceFrom"
                    value={searchParams.priceFrom}
                    onChange={handleInputChange}
                    type="number"
                    className="w-full"
                  />
                  <span>to</span>
                  <Input
                    id="priceTo"
                    placeholder="To"
                    name="priceTo"
                    value={searchParams.priceTo}
                    onChange={handleInputChange}
                    type="number"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <RadioGroup value={searchParams.type} onValueChange={handleRadioChange} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solo" id="solo" />
                    <Label htmlFor="solo">Solo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="band" id="band" />
                    <Label htmlFor="band">Band</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full">
                Search
              </Button>
            </form>
          </div>

          {/* Results Section */}
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-6">Search Results</h2>

            {artists.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <img src={nodata || "/placeholder.svg"} className="max-h-[400px] max-w-[400px]" alt="No data" />
                <p className="text-lg font-bold mt-4">No results found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {artists.map((artist) => (
                  <ArtistCard
                    key={artist.userId}
                    userId={artist.userId}
                    name={artist.name}
                    specialization={artist.specialization}
                    location={artist.location}
                    price={artist.pricePerShow}
                    genre={artist.genres}
                    type={artist.type}
                    imgSrc={artist.profilePic}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {artists.length > 0 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(page - 1)}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-4">
                      {page} / {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(page + 1)}
                      className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function ArtistCard({ userId, name, specialization, location, price, genre, type, imgSrc }) {
  const token = localStorage.getItem("token")

  return (
    <Card className="overflow-hidden h-full">
      <div className="relative group">
        <Link to={{ pathname: "/view-profile", search: `?id=${userId}` }}>
          <span className="sr-only">{name}</span>
          <img
            alt={name}
            className="aspect-[3/2] w-full object-cover group-hover:opacity-75 transition-opacity"
            height={300}
            src={`${BACKEND_URL}/Images/${imgSrc}`}
            width={300}
          />
        </Link>
        <CardContent className="p-4">
          <h4 className="font-semibold text-lg">{name}</h4>
          <p className="text-muted-foreground text-sm">{specialization}</p>

          <div className="space-y-2 mt-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{location}</span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Rs {price} per show</span>
            </div>

            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{genre}</span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{type}</span>
            </div>
          </div>

          <Link
            to={
              token
                ? {
                    pathname: "/booking-form",
                    search: `?id=${userId}&name=${name}&price=${price}&artistpic=${imgSrc}`,
                  }
                : "/login"
            }
            className="block mt-4"
          >
            <Button className="w-full">{token ? "Book" : "Login to Book"}</Button>
          </Link>
          <Link to={{ pathname: "/chat", search: `?partnerId=${userId}` }} className="block mt-2">
          <Button variant="outline" className="w-full"> Chat with Artist</Button>
          </Link>
        </CardContent>
      </div>
    </Card>
  )
}
