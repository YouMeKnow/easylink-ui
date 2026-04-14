// src/data/contactIcons.jsx
import React from "react";

import {
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
  FaPhone,
  FaGlobe,
  FaEnvelope,
  FaFacebook,
  FaVk,
  FaTiktok,
  FaLinkedin,
  FaYoutube,
  FaTwitter,
  FaSnapchat,
  FaDiscord,
  FaGithub,
} from "react-icons/fa";
import { SiX } from "react-icons/si";

const iconMap = {
  website: <FaGlobe color="#007bff" />,
  instagram: <FaInstagram color="#E4405F" />,
  whatsapp: <FaWhatsapp color="#25D366" />,
  telegram: <FaTelegram color="#229ED9" />,
  facebook: <FaFacebook color="#1877f3" />,
  // vk: <FaVk color="#4C75A3" />,
  tiktok: <FaTiktok />,  // uses currentColor — adapts to theme
  linkedin: <FaLinkedin color="#0A66C2" />,
  youtube: <FaYoutube color="#FF0000" />,
  twitter: <SiX />,       // uses currentColor — adapts to theme
  snapchat: <FaSnapchat color="#FFFC00" />,
  discord: <FaDiscord color="#5865F2" />,
  github: <FaGithub />,   // uses currentColor — adapts to theme
  phone: <FaPhone color="#007bff" />,
  email: <FaEnvelope color="#007bff" />,
};

export default iconMap;
