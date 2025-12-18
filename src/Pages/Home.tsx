import Hero from "@/components/Shared/Hero/ConnectionFlow2";
import FeaturedClub from "@/components/Shared/Hero/FeaturedClub";
import HowItWorks from "@/components/Shared/Hero/HowItWork";
import WhyJoinClub from "@/components/Shared/Hero/WhyJoinClub";

const Home = () => {
  return (
    <>
      <Hero />
      <div className=" w-11/12 mx-auto">
        <FeaturedClub />
        <HowItWorks />
        <WhyJoinClub />
      </div>
    </>
  );
};

export default Home;
