import React from "react";
import Head from "next/head";
import StoreDashboardLayout from "components/layouts/store-dashboard";

const Products = () => {
  return (
    <StoreDashboardLayout>
      <Head>
        <title>Products - Frowth</title>
      </Head>
      <h1>Products page</h1>
    </StoreDashboardLayout>
  );
};

export default Products;
