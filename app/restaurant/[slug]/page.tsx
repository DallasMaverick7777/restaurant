import { Prisma, PrismaClient } from "@prisma/client";
import React from 'react';
import Header from "../../components/Header";
import RestaurantNavBar from "../[slug]/components/RestaurantNavBar";
import Description from "./components/Description";
import Rating from "./components/Rating";
import Title from "./components/Title";
import Images from "./components/Images";
import Reviews from "./components/reviews";
import ReservationCard from "./components/ReservationCard";

const prisma = new PrismaClient();

interface Restaurant {
  id: number;
  name: string;
  images: string[];
  description: string;
  slug: string;
  open_time: string;
  close_time: string;
  
}

const fetchRestaurantBySlug = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug
    },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
      reviews: true,
      open_time: true,
      close_time: true
    }
  });

  if(!restaurant){
    throw new Error();
  }

  return restaurant;
}

export default async function RestaurantDetails({params}: {params: {slug: string}}) {
 
  const restaurant = await fetchRestaurantBySlug(params.slug)

  // console.log({restaurant})
    return (
 <>
      <div className="bg-white w-[70%] rounded p-3 shadow">   
    <RestaurantNavBar slug={restaurant.slug}/>   
    <Title name={restaurant.name}/>   
    <Rating />  
    <Description description={restaurant.description}/>    
    <Images images={restaurant.images}/>     
    <Reviews />  
      </div>
      <div className="w-[27%] relative text-reg">
    <ReservationCard 
      openTime={restaurant.open_time}
      closeTime={restaurant.close_time}
      slug={restaurant.slug}
      />
      </div>
  </>
    )
}