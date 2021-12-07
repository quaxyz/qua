import React from "react";
import Head from "next/head";
import StoreDashboardLayout from "components/layouts/store-dashboard";

const Orders = () => {
  return (
    <StoreDashboardLayout>
      <Head>
        <title>Orders - Frowth</title>
      </Head>

      <h1>Orders page</h1>
    </StoreDashboardLayout>
  );
};

export default Orders;
