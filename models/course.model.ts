import mongoose, { Document, Model, Schema, mongo } from "mongoose";
import { IUser } from "./user.model";

interface ICourseData extends Document {
  title: string;
  videoSection: string;
  section_parts: { title: string }[];
}

const courseDataSchema = new Schema<ICourseData>({
  title: String,
  videoSection: String,
  section_parts: [{ title: String }],
});

interface IWhoShouldAttend extends Document {
  title: string;
}

const WhoShouldAttend = new Schema<IWhoShouldAttend>({
  title: String,
});

interface ICourseMetadata extends Document {
  headline: string;
  body: string;
  overview: string;
  preview_video: string;
  preview_image: string;
  objectives: { title: string }[];
  prerequisites: { title: string }[];
  audience: { title: string }[];
  skills_covered: { title: string }[];
  key_features: { title: string }[];
  benefits: { title: string }[];
  resources: { title: string }[];
  outcomes: { title: string }[];
  certification_text: string;
  certification_image: string;
  FAQs: { question: string; answer: string }[];
  curriculum: ICourseData[];
  who_should_attend: IWhoShouldAttend[];
}

const CourseMetadataSchema = new Schema<ICourseMetadata>({
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

interface ITrainingBatch extends Document {
  description: string;
  batch_name: string;
  isPaid: boolean;
  trainer: string;
  start_time: Date;
  enrollment_end_date: Date;
  end_date: Date;
  capacity: number;
  batch_status: string;
}

const TrainingBatchSchema = new Schema<ITrainingBatch>({
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

interface IBatchSessions extends Document {
  batch: string;
  batch_sections: { name: string; start_time: Date; end_time: Date }[];
}

const BatchSessionsSchema = new Schema<IBatchSessions>({
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

interface ICourse extends Document {
  title: string;
  level: string;
  category: string;
  assessment_required: string;
  duration: number;
  language: string;
  training_status: string;
  description: string;
  owned_by: string;
  endorsed_by: string;
  assessment: string;
  price: number;
  currency: string;
  ratings: number;
  coupon_code: string;
  discount: number;
  preview_image_uri: string;
  file_attachment_uri: string;
  isPaid: boolean;
  training_mode: string;
  training_metadata: ICourseMetadata;
  training_batches: ITrainingBatch;
  batch_sessions: IBatchSessions;
}

const courseSchema = new Schema<ICourse>(
  {
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
  },
  {
    timestamps: true,
  }
);

const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;
