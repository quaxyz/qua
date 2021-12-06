import React from "react";
import Head from "next/head";
import type { NextPage } from "next";
import StoreDashboardLayout from "components/layouts/store-dashboard";

const Dashboard: NextPage = () => {
  return (
    <StoreDashboardLayout>
      <Head>
        <title>Dashboard - Frowth</title>
      </Head>

      <h2>interesting stuff </h2>
    </StoreDashboardLayout>
  );
};

export default Dashboard;
