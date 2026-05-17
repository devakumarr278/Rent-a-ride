import Booking from '../../models/BookingModel.js'
import Vehicle from '../../models/vehicleModel.js'
import { errorHandler } from '../../utils/error.js'

export const vendorBookings = async (req, res, next) => {
    try {
        const vendorId = req.user
        
        if (!vendorId) {
          return next(errorHandler(401, "Vendor not authenticated"));
        }

        console.log("vendorBookings - vendorId:", vendorId);

        // Get all vehicles for this vendor using addedBy field
        const vendorVehicles = await Vehicle.find({ addedBy: vendorId })
        
        console.log("vendorBookings - vendor vehicles count:", vendorVehicles.length);

        if (!vendorVehicles || vendorVehicles.length === 0) {
          return res.status(200).json([])
        }

        const vehicleIds = vendorVehicles.map(v => v._id)

        // Get all bookings for these vehicles with vehicle details
        const bookings = await Booking.aggregate([
          {
            $match: {
              vehicleId: { $in: vehicleIds }
            }
          },
          {
            $lookup: {
              from: "vehicles",
              localField: "vehicleId",
              foreignField: "_id",
              as: "vehicleDetails",
            },
          },
          {
            $unwind: {
              path: "$vehicleDetails",
              preserveNullAndEmptyArrays: true
            },
          },
        ]);

        console.log("vendorBookings - bookings count:", bookings.length);
        res.status(200).json(bookings);
      } catch (error) {
        console.log("vendorBookings error:", error);
        next(errorHandler(500, "error in vendorBookings"));
      }
  };
  