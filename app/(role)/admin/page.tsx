import prisma from "lib/prisma";
import React from "react";
import DoughnutChart from "./Chart";

export default async function AdminPage() {
  const approvedVsUnapprovedSums: number[] = [];
  const walletsVsCashSums: number[] = [];

  const approvedOrdersData = await prisma.order.findMany({
    where: { customer: { role: "customer" }, approved: true },
    select: { amount: true, date: true },
  });
  const unapprovedOrdersData = await prisma.order.findMany({
    where: { customer: { role: "customer" }, approved: false },
    select: { amount: true, date: true },
  });

  const walletOrdersData = await prisma.order.findMany({
    where: { customer: { role: "customer" }, isCash: false },
    select: { amount: true, date: true },
  });
  const cashOrdersData = await prisma.order.findMany({
    where: { customer: { role: "customer" }, isCash: true },
    select: { amount: true, date: true },
  });

  function sumOfAllOrders(
    data: {
      amount: number;
      date: Date;
    }[],
    array: number[]
  ) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i].amount;
    }
    array.push(sum);
  }
  sumOfAllOrders(approvedOrdersData, approvedVsUnapprovedSums);
  sumOfAllOrders(unapprovedOrdersData, approvedVsUnapprovedSums);
  sumOfAllOrders(walletOrdersData, walletsVsCashSums);
  sumOfAllOrders(cashOrdersData, walletsVsCashSums);

  console.log(approvedVsUnapprovedSums);

  const approvedVsUnapprovedSumsChart = {
    labels: ["Approved Order Sales", "Unapproved Order Sales"],
    datasets: [
      {
        label: "Sum of Sales($)",
        data: approvedVsUnapprovedSums,
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };
  const walletVsCashSumsChart = {
    labels: ["Wallet Order Sales", "Cash Order Sales"],
    datasets: [
      {
        label: "Sum of Sales($)",
        data: walletsVsCashSums,
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div className="h-full">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="flex flex-row">
        <DoughnutChart data={approvedVsUnapprovedSumsChart} chartTitle="Approved vs. Unapproved Orders" />
        <DoughnutChart data={walletVsCashSumsChart} chartTitle="Wallet vs. Cash Orders" />
      </div>
    </div>
  );
}
