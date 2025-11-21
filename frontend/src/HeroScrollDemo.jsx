"use client";
import React from "react";
import { ContainerScroll } from '../src/components/ui/container-scroll-animation'
import TrainImage from '../src/assets/Train.png'
export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl text-red-700 font-semibold text-black dark:text-white">
           Maximizing Section Throughput<br />  
              <span className="text-4xl text-red-400 md:text-[3rem] font-bold mt-1 leading-none">
                 Using Al-Powered Precise Train Traffic Control 
              </span>
            </h1>
          </>
        }>
        <img
          src={TrainImage}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false} />
      </ContainerScroll>
    </div>
  );
}
