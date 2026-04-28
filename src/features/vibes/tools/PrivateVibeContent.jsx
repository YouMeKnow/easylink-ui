import React from "react";
import { useTranslation } from "react-i18next";
import { Lock } from "lucide-react";

import AvatarPicker from "./AvatarPicker.jsx";
import "./VibeContent.css";
import "./PrivateVibeContent.css";

export default function PrivateVibeContent({
    name,
    description,
    photo,
    type,
}) {
    const { t } = useTranslation("vibe_content");

    const slug = (type || "").toString().toLowerCase();
    const pretty = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : t("default_type");
    const typeLabel = slug ? t(`types.${slug}`, { defaultValue: pretty }) : t("default_type");

    return (
        <div className="vibe-content private-vibe-content">

            {/* visible part */}
            <div className="vibe-content__avatar">
                <AvatarPicker
                    name={name}
                    photo={photo}
                    editMode={false}
                />
            </div>

            <div className="vibe-content__main">
                <div className="vibe-content__head">
                    <div className="vibe-content__title">
                        <h3 className="mb-0 vibe-content__name">
                            {name || t("your_name")}
                        </h3>
                    </div>

                    <div className="vibe-content__type text-primary">
                        {typeLabel}
                    </div>
                </div>

                <div className="vibe-content__desc">
                    <p className={`vibe-content__desc-text ${description ? "" : "is-empty"}`}>
                        {description || t("default_description")}
                    </p>
                </div>

                {/* locked area */}
                <div className="private-vibe-content__locked">
                    <div className="private-vibe-content__overlay">

                        <div className="private-vibe-content__lock-icon">
                            <Lock size={20} />
                        </div>

                        <div className="private-vibe-content__title">
                            {t("private_vibe", { defaultValue: "Private Vibe" })}
                        </div>

                        <div className="private-vibe-content__text">
                            {t("private_hint", {
                                defaultValue: "Subscribe to view contacts and full profile.",
                            })}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}