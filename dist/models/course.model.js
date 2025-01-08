"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const courseDataSchema = new mongoose_1.Schema({
    title: String,
    videoSection: String,
    section_parts: [{ title: String }],
});
const WhoShouldAttend = new mongoose_1.Schema({
    title: String,
});
const CourseMetadataSchema = new mongoose_1.Schema({
    headline: {
        type: String,
        required: false,
    },
    body: {
        type: String,
        required: false,
    },
    overview: {
        type: String,
        required: false,
    },
    preview_video: {
        type: String,
        required: false,
    },
    preview_image: {
        type: String,
        requied: true,
    },
    objectives: [{ title: String }],
    prerequisites: [{ title: String }],
    audience: [{ title: String }],
    skills_covered: [{ title: String }],
    key_features: [{ title: String }],
    benefits: [{ title: String }],
    resources: [{ title: String }],
    outcomes: [{ title: String }],
    certification_text: {
        type: String,
        required: false,
    },
    certification_image: {
        type: String,
        required: false,
    },
    FAQs: [
        {
            question: String,
            answer: String,
        },
    ],
    curriculum: [courseDataSchema],
    who_should_attend: [WhoShouldAttend],
});
const TrainingBatchSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: false,
    },
    batch_name: {
        type: String,
        required: false,
    },
    isPaid: {
        type: Boolean,
        required: false,
    },
    trainer: {
        type: String,
        required: false,
    },
    start_time: {
        type: Date,
        required: false,
    },
    enrollment_end_date: {
        type: Date,
        required: false,
    },
    end_date: {
        type: Date,
        required: false,
    },
});
const BatchSessionsSchema = new mongoose_1.Schema({
    batch: {
        type: String,
        required: false,
    },
    batch_sections: [
        {
            name: String,
            start_time: Date,
            end_time: Date,
        },
    ],
});
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: false,
    },
    level: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    assessment_required: {
        type: String,
        required: false,
    },
    duration: {
        type: Number,
        required: false,
    },
    language: {
        type: String,
        required: false,
    },
    training_status: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    owned_by: {
        type: String,
        required: false,
    },
    endorsed_by: {
        type: String,
        required: false,
    },
    assessment: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: false,
    },
    currency: {
        type: String,
        required: false,
    },
    ratings: {
        type: Number,
        required: false,
    },
    coupon_code: {
        type: String,
        required: false,
    },
    discount: {
        type: Number,
        required: false,
    },
    preview_image_uri: {
        type: String,
        required: false,
    },
    file_attachment_uri: {
        type: String,
        required: false,
    },
    isPaid: {
        type: Boolean,
        required: false,
    },
    training_mode: {
        type: String,
        required: true,
    },
    training_metadata: CourseMetadataSchema,
    training_batches: TrainingBatchSchema,
    batch_sessions: [BatchSessionsSchema],
}, {
    timestamps: true,
});
const CourseModel = mongoose_1.default.model("Course", courseSchema);
exports.default = CourseModel;
