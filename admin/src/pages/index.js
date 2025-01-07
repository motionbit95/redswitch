import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BDSMQuestions from "./bdsm/bdsm_questions";
import BDSMResults from "./bdsm/bdsm_results";
import Account from "./admin/account";
import Provider from "./provider/provider";
import Branch from "./admin/branch";
import Main from "./admin/main";
import FranchisePost from "./provider/franchise_post";
import Product from "./product/product";
import Inventory from "./product/inventory";
import Purchase_order from "./product/purchase_order";
import Order from "./order/order";
import BDSMStatistics from "./bdsm/bdsm_statistics";
import Material from "./product/material";
import BDSMAdvertise from "./bdsm/bdsm_advertise";
import NoticeBoard from "./post/post";
import InquiryBoard from "./post/inquiry";
import Spot from "./admin/spot";
import PaymentSummary from "./sales/salse";
import PaymentSummaryByBranch from "./sales/branch";

function App(props) {
  const { currentUser } = props;
  return (
    <div>
      {/* 페이지 라우팅 */}
      <Routes>
        <Route path="/dashboard" element={<Main currentUser={currentUser} />} />
        <Route path="/admin/account" element={<Account />} />
        <Route path="/admin/spot" element={<Spot />} />

        <Route path="/branch/branch" element={<Branch />} />

        <Route path="/provider/provider" element={<Provider />} />
        <Route path="/provider/post" element={<FranchisePost />} />

        <Route path="/bdsm/questions" element={<BDSMQuestions />} />
        <Route path="/bdsm/results" element={<BDSMResults />} />
        <Route path="/bdsm/advertise" element={<BDSMAdvertise />} />
        <Route path="/bdsm/trend" element={<BDSMStatistics />} />

        <Route
          path="/product/material"
          element={<Material currentUser={currentUser} />}
        />
        <Route
          path="/product/product"
          element={<Product currentUser={currentUser} />}
        />
        <Route
          path="/product/inventory"
          element={<Inventory currentUser={currentUser} />}
        />
        <Route path="/product/purchase_order" element={<Purchase_order />} />

        <Route path="/order" element={<Order currentUser={currentUser} />} />

        <Route
          path="/post/notification"
          element={<NoticeBoard currentUser={currentUser} />}
        />
        <Route
          path="/post/inquiry"
          element={<InquiryBoard currentUser={currentUser} />}
        />

        <Route
          path="/sales/sales"
          element={<PaymentSummary currentUser={currentUser} />}
        />
        <Route path="/sales/branch" element={<PaymentSummaryByBranch />} />
      </Routes>
    </div>
  );
}

export default App;
