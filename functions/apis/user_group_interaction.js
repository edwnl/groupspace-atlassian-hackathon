// // NOTE: Students will have their own userID once singed in via Google.
const db = require("firebase-admin").firestore();
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { handleAuthAndParams, handleAuth } = require("../misc/utils");

// Create a request when a user requests to join a group. The leader can approve or reject this.
exports.userRequestGroup = onCall(async ({ data, context }) => {
  const uid = handleAuthAndParams(context, data, ["group_id"]);

  // Retrieve group reference
  const groupRef = db.collection("groups").doc(data.group_id);
  const groupSnapshot = await groupRef.get();

  // Check if group exists
  if (!groupSnapshot.exists) {
    throw new HttpsError("not-found", "Group does not exist. (ID: " + data.group_id + ").");
  }

  // Add request to the group
  await groupRef.collection("requests").doc(uid).set({
    user_id: uid,
    status: "pending",
    timestamp: Date.now(),
  });

  return { success: true };
});

// Create a request when a user is invited to a group by the leader. Only the leader can do this.
exports.userInvitedToGroup = onCall(async ({ data, context }) => {
  const uid = handleAuthAndParams(context, data, ["group_id", "invited_id"]);

  // Retrieve group reference
  const groupRef = db.collection("groups").doc(data.group_id);
  const groupSnapshot = await groupRef.get();

  // Check if group exists
  if (!groupSnapshot.exists) {
    throw new HttpsError("not-found", "Group does not exist. (ID: " + data.group_id + ").");
  }

  // Check if the authenticated user is the leader of the group
  const groupData = groupSnapshot.data();
  if (groupData.leader_id !== uid) {
    throw new HttpsError(
      "permission-denied",
      "Only the group leader can invite users to the group.",
    );
  }

  // Add invitation to the group
  await groupRef.collection("requests").doc(data.invited_id).set({
    user_id: data.invited_id,
    status: "invited",
    timestamp: Date.now(),
  });

  return { success: true };
});

// Process a request decision (approve or reject)
exports.processRequestDecision = onCall(async ({ data, context }) => {
  const uid = handleAuthAndParams(context, data, ["request_id"]);

  // Retrieve request reference
  const requestRef = db.collection("requests").doc(data.request_id);
  const requestSnapshot = await requestRef.get();

  // Check if request exists
  if (!requestSnapshot.exists) {
    throw new HttpsError("not-found", "Request does not exist. (ID: " + data.request_id + ").");
  }

  // Check if the authenticated user is the leader of the group
  const requestData = requestSnapshot.data();
  const groupRef = db.collection("groups").doc(requestData.group_id);
  const groupSnapshot = await groupRef.get();

  if (!groupSnapshot.exists) {
    throw new HttpsError("not-found", "Group does not exist.");
  }

  const groupData = groupSnapshot.data();
  if (groupData.leader_id !== uid) {
    throw new HttpsError(
      "permission-denied",
      "Only the group leader can process request decisions.",
    );
  }

  // Update request status
  await requestRef.update({
    status: data.approved ? "approved" : "rejected",
  });

  return { success: true };
});

// Within the group, create a history of join and leaves, with timestamps and a message.
exports.userLeaveGroup = onCall(async ({ data, context }) => {
  const uid = handleAuthAndParams(context, data, ["group_id"]);

  // Retrieve group reference
  const groupRef = db.collection("groups").doc(data.group_id);
  const groupSnapshot = await groupRef.get();

  // Check if group exists
  if (!groupSnapshot.exists) {
    throw new HttpsError("not-found", "Group does not exist. (ID: " + data.group_id + ").");
  }

  // Add leave history to the group
  await groupRef.collection("history").add({
    user_id: uid,
    action: "leave",
    reason: data.reason,
    timestamp: Date.now(),
  });

  return { success: true };
});

// User joins a group
exports.userJoinGroup = onCall(async ({ data, context }) => {
  const uid = handleAuthAndParams(context, data, ["group_id"]);

  // Retrieve group reference
  const groupRef = db.collection("groups").doc(data.group_id);
  const groupSnapshot = await groupRef.get();

  // Check if group exists
  if (!groupSnapshot.exists) {
    throw new HttpsError("not-found", "Group does not exist. (ID: " + data.group_id + ").");
  }

  // Add join history to the group
  await groupRef.collection("history").add({
    user_id: uid,
    action: "join",
    timestamp: Date.now(),
  });

  return { success: true };
});

// Finds if a user belongs to a group. Can have no group.
// Can only be part of one group.
exports.getUserGroup = onCall(async ({ data, context }) => {
  // Authentication
  const uid = handleAuth(data, context);

  // Retrieve group reference
  const querySnapshot = await db
    .collectionGroup("groups")
    .where("members", "array-contains", uid)
    .get();

  let group = null;
  querySnapshot.forEach((doc) => {
    group = {
      group_id: doc.id,
      ...doc.data(),
    };
  });

  return { group };
});