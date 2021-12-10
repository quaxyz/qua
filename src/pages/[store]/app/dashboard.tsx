import React from "react";

import type { NextPage } from "next";
import StoreDashboardLayout from "components/layouts/store-dashboard";

const Dashboard: NextPage = () => {
  return (
    <StoreDashboardLayout title="Dashboard">
      <h2>interesting stuff </h2>
    </StoreDashboardLayout>
  );
};

export default Dashboard;
