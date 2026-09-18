import HomePageCarousel from "@/components/frontstore/homepage/carousel";
import { Button } from "@/components/ui/button";
import { disk } from "@/src/fs";
import Image from "next/image";

export default function Home() {
  async function saveFile(){
    "use server"
    try{
      await disk.put("test.txt", "test")
    } catch(e){
      console.log(e);
    }


    
  }
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans ">
      <HomePageCarousel/>
      <form action={saveFile}>
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
