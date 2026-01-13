// src/app/router/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "@/features/auth/AuthGuard";
import NotificationsPage from "@/features/notifications/NotificationsPage";

// pages
import Home from "@/pages/Home/Home";
import About from "@/pages/About";
import Terms from "@/pages/legal/Terms";
import Privacy from "@/pages/legal/Privacy";
import Ads from "@/pages/legal/Ads";

import ProfilePage from "@/pages/ProfilePage";
import SignIn from "@/features/auth/signin/SignIn";
import EmailVerificationSentPage from "@/pages/EmailVerificationSentPage";
import EmailVerifiedPage from "@/pages/EmailVerifiedPage";

import VibePage from "@/pages/VibePage";

// features
import SignUp from "@/features/auth/signup/SignUp";
import Review from "@/features/review/Review";
import CreateVibe from "@/features/vibes/forms/CreateVibe";
import UserVibes from "@/features/vibes/UserVibes";
import PublicVibePage from "@/features/vibes/PublicVibePage";

import InteractionsHome from "@/features/vibes/interactions/InteractionsHome";
import MyCircle from "@/features/vibes/interactions/MyCircle";
import MyOffers from "@/features/vibes/interactions/MyOffers";
import InteractionsPageBasic from "@/features/vibes/interactions/MyCircle";

import OfferEditorPage from "@/features/vibes/offers/pages/OfferEditorPage";
import OfferAnalyticsPage from "@/features/vibes/offers/pages/OfferAnalyticsPage";
import OfferDetailsPage from "@/features/vibes/offers/pages/OfferDetailsPage";

import CatalogForm from "@/features/vibes/catalog/catalogForm";
import CatalogItemPage from "@/features/vibes/catalog/pages/CatalogItemPage";


export default function AppRoutes({ questions, setQuestions }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />

      <Route path="/profile" element={<ProfilePage />} />

      <Route
        path="/signup"
        element={
          <SignUp />
        }
      />

      <Route
        path="/signin"
        element={<SignIn questions={questions} setQuestions={setQuestions} />}
      />
      <Route path="/login" element={<Navigate to="/signin" />} />

      <Route path="/review" element={<Review />} />
      
      <Route path="/notifications" element={<NotificationsPage />} />

      <Route path="/create-vibe" element={<CreateVibe />} />
      <Route path="/my-vibes" element={<UserVibes />} />
      <Route path="/vibes" element={<UserVibes />} />
      <Route path="/vibes/:id" element={ <AuthGuard> <VibePage /> </AuthGuard>}/>
      <Route path="/view/:id" element={<PublicVibePage />} />

      <Route path="/vibes/:id/interactions" element={<InteractionsHome />} />
      <Route path="/vibes/:id/interactions/circle" element={<MyCircle />} />
      <Route path="/vibes/:id/interactions/offers" element={<MyOffers />} />
      <Route path="/vibes/:id/interactions-basic" element={<InteractionsPageBasic />} />

      <Route path="/offers/new" element={<OfferEditorPage />} />
      <Route path="/offers/:id/edit" element={<OfferEditorPage />} />   {/* edit */}

      <Route path="/offers/:id" element={<OfferDetailsPage />} />
      <Route path="/offers/:id/analytics" element={<OfferAnalyticsPage />} /> 

      <Route path="/email-verification-sent" element={<EmailVerificationSentPage />} />
      <Route path="/email-verified" element={<EmailVerifiedPage />} />

      <Route path="/catalog/new" element={<CatalogForm />} />
      <Route path="/catalog/:id/edit" element={<CatalogForm />} />
      <Route path="/catalog/:id" element={<CatalogItemPage />} />

      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/ads" element={<Ads />} />
    </Routes>
  );
}
