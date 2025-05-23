import React from "react";

export default function Carousel() {
  return (
    <div>
      <div className="carousel slide" data-bs-ride="carousel" style={{ borderTop: "2px Solid White" }}>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://via.placeholder.com/1500x650.png?text=Image+1"
              className="d-block w-100"
              alt="..."
              style={{ height: "650px", objectFit: "cover" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://via.placeholder.com/1500x650.png?text=Image+2"
              className="d-block w-100"
              alt="..."
              style={{ height: "650px", objectFit: "cover" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://via.placeholder.com/1500x650.png?text=Image+3"
              className="d-block w-100"
              alt="..."
              style={{ height: "650px", objectFit: "cover" }}
            />
          </div>
        </div>
        <div className="carousel-caption text-center text-lg-start" style={{ position: "absolute", height: "70%", left: "7%" }}>
          <h5
            className="text-shadow"
            style={{
              fontFamily: "Raleway, sans-serif",
              fontSize: "80px",
              fontWeight: "bold",
            }}
          >
            Discover and hire <br />
            talented musicians <br />
            today
          </h5>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
            }}
          >
            Welcome to MyArtistry, where artists and hirers connect to create <br />
            unforgettable Artistry experiences. Join us now and find the perfect <br />
            match for your next event.
          </p>
        </div>
      </div>
    </div>
  );
}
