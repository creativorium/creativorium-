import React from "react";
import Layouts from "@layouts/Layouts";
import dynamic from "next/dynamic";

import { getSortedPostsData } from "@library/posts";

import HeroOneSection from "@components/sections/HeroOne";
import HeroTwoSection from "@components/sections/HeroTwo";
import AboutSection from "@components/sections/About";
import ServicesSection from "@components/sections/Services";
import TeamSection from "@components/sections/Team";
import LatestPostsSection from "@components/sections/LatestPosts";

const TestimonialSlider = dynamic( () => import("@components/sliders/Testimonial"), { ssr: false } );
const PartnersSlider = dynamic( () => import("@components/sliders/Partners"), { ssr: false } );

const HOST_PORTFOLIO_SUBDOMAIN = "my.creativorium.com";

const Home1 = (props) => {
  const useHero2 = props.useHero2 === true;

  return (
    <Layouts>
      {useHero2 ? <HeroTwoSection /> : <HeroOneSection />}
      <AboutSection />
      <ServicesSection />
      <LatestPostsSection posts={props.posts} />
    </Layouts>
  );
};
export default Home1;

export async function getServerSideProps(context) {
  const req = context.req || {};
  const headers = req.headers || {};
  // Prefer x-forwarded-host (original domain) when behind Vercel/proxy, fallback to host
  const rawHost =
    headers["x-forwarded-host"] ||
    headers["x-vercel-forwarded-host"] ||
    headers.host ||
    "";
  // Handle comma-separated list (first is client) and strip port
  const host = (typeof rawHost === "string" ? rawHost.split(",")[0].trim() : "").split(":")[0].toLowerCase();
  const useHero2 =
    host === "my.creativorium.com" || host.endsWith(".my.creativorium.com");

  const allPosts = getSortedPostsData();

  return {
    props: {
      useHero2,
      posts: allPosts
    }
  };
}