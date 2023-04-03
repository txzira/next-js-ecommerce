"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from "chart.js";
import { Doughnut } from "react-chartjs-2";

export default function DoughnutChart({ data, chartTitle }: { data: ChartData<"doughnut", number[], unknown>; chartTitle: string }) {
  ChartJS.register(ArcElement, Tooltip, Legend);
  return (
    <div className="flex flex-col w-1/3 h-1/2 items-center ">
      <h1 className="">{chartTitle}</h1>
      <div className="">
        <Doughnut data={data} />
      </div>
    </div>
  );
}
