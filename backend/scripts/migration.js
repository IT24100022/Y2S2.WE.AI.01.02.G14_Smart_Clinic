// MongoDB Shell Script for Appointment ID Migration
// Run this script in MongoDB shell: mongo dentali < migration.js

// Step 1: Create counters collection and initialize appointment_id counter
db.counters.insertOne({
  _id: "appointment_id",
  seq: 0
});

print("Counters collection created with appointment_id counter initialized to 0");

// Step 2: Get all existing appointments sorted by creation date (oldest first)
var existingAppointments = db.appointments.find({}).sort({ createdAt: 1 }).toArray();

print("Found " + existingAppointments.length + " existing appointments to migrate");

// Step 3: Update existing appointments with sequential appointment_id
var bulkOps = [];
var counter = 1;

existingAppointments.forEach(function(appointment) {
  var appointmentId = "APT" + counter.toString().padStart(4, '0');
  
  bulkOps.push({
    updateOne: {
      filter: { _id: appointment._id },
      update: { 
        $set: { 
          appointment_id: appointmentId,
          updatedAt: new Date()
        }
      }
    }
  });
  
  counter++;
});

// Step 4: Execute bulk update with ordered: false for better performance
if (bulkOps.length > 0) {
  var result = db.appointments.bulkWrite(bulkOps, { ordered: false });
  print("Successfully updated " + result.modifiedCount + " appointments with appointment_id");
  
  // Step 5: Update the counter to the last used sequence number
  var finalSeq = counter - 1;
  db.counters.updateOne(
    { _id: "appointment_id" },
    { $set: { seq: finalSeq } }
  );
  
  print("Counter updated to sequence: " + finalSeq);
  print("Next appointment will be assigned: APT" + (finalSeq + 1).toString().padStart(4, '0'));
} else {
  print("No existing appointments found to migrate");
}

// Step 6: Verify the migration
var verification = db.appointments.find({ appointment_id: { $exists: true } }).count();
print("Verification: " + verification + " appointments now have appointment_id field");

// Step 7: Create indexes for better performance
db.appointments.createIndex({ appointment_id: 1 }, { unique: true });
db.appointments.createIndex({ patientId: 1 });
db.appointments.createIndex({ doctorId: 1 });
db.appointments.createIndex({ date: 1 });
db.appointments.createIndex({ status: 1 });
db.appointments.createIndex({ doctorId: 1, date: 1, time: 1 });

print("Indexes created for better performance");

print("Migration completed successfully!");
