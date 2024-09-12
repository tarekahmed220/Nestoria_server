// import { model, Schema } from "mongoose";

// const shippingAddress = new Schema(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     Company: {
//       type: String,
//     },
//     streetAddress: [
//       {
//         huoseNumber: {
//           type: String,
//           required: true,
//         },
//         apartment: {
//           type: String,
//         }
//       }
//     ],
//     city: {
//       type: String,
//       required: true,
//     },
//     state: {
//       type: String,
//     },
//     PINCode: {
//       type: Number,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default model("address", shippingAddress);

import { model, Schema } from "mongoose";

const shippingAddress = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
    },
    streetAddress: {
      houseNumber: {
        type: String,
        required: true,
      },
      apartment: {
        type: String,
      },
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    PINCode: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("ShippingAddress", shippingAddress);
