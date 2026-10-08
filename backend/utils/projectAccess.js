const Project = require("../models/Project");
const { createHttpError, validateObjectId, sameId } = require("./http");

async function findProjectForMember(
  projectId,
  user,
  { populate = false, allowAdmin = false } = {},
) {
  validateObjectId(projectId, "project id");

  let query = Project.findById(projectId);
  if (populate) query = query.populate("owner", "name email avatar role").populate("members", "name email avatar role");
  const project = await query;

  if (!project) {
    throw createHttpError(404, "Project not found.");
  }

  const isMember = sameId(project.owner, user._id)
    || project.members.some((member) => sameId(member, user._id));
  if (!isMember && !(allowAdmin && user.role === "admin")) {
    throw createHttpError(403, "You do not have access to this project.");
  }

  return project;
}

function isProjectOwner(project, user) {
  return sameId(project.owner, user._id);
}

module.exports = { findProjectForMember, isProjectOwner };
