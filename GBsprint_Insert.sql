-- INSERT INTO GroupBSprint.Band(
--   Band_ID,
--   Name,
--   Level,
--   Training,
--   Competencies,
--   Responsibilities
-- ) VALUES (
--   1,
--   "Leadership Community",
--   0,
--   "Mindset Modules",
--   "Advanced",
--   "Accountable for successful delivery of large-scale apps"
-- );

INSERT INTO GroupBSprint.Capabilities(
  Cap_ID,
  Name,
  Job_Family
) VALUES (
  1,
  "Engineering",
  "Engineering and Strategy Planning"
);

INSERT INTO GroupBSprint.JobRoles(
  Role_ID,
  Name,
  Spec_Sum,
  Cap_ID,
  Band_ID
) VALUES (
  1,
  "Chief Technical Officer",
  "Takes care of computer systems and IT processes",
  1,
  1
);
