import { dataSource } from "../dataSource/dataSource";
import { Deliverable } from "../entities/Deliverable";
import { Project } from "../entities/Project";
import { Task } from "../entities/Task";
import { DeliverableStatus } from "../enums/DeliverableStatus";
import { TaskStatus } from "../enums/TaskStatus";

function randomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
  return date.toISOString().split("T")[0];
}

function assignDeliverableStatus(endDate: string): DeliverableStatus {
  const today = new Date().toISOString().split("T")[0];
  if (endDate < today) {
    return Math.random() < 0.7
      ? DeliverableStatus.APPROVED
      : DeliverableStatus.IN_PROGRESS;
  }
  return Math.random() < 0.5
    ? DeliverableStatus.IN_PROGRESS
    : DeliverableStatus.NOT_STARTED;
}

function assignTaskStatus(endDate: string): TaskStatus {
  const today = new Date().toISOString().split("T")[0];
  if (endDate < today) {
    return Math.random() < 0.8 ? TaskStatus.COMPLETED : TaskStatus.IN_PROGRESS;
  }
  return Math.random() < 0.5 ? TaskStatus.IN_PROGRESS : TaskStatus.NOT_STARTED;
}

async function populateRealisticTestData() {
  await dataSource.initialize();

  const projects = await dataSource.getRepository(Project).find();

  const deliverableThemes = [
    "Design system",
    "Frontend development",
    "Backend integration",
    "API integration",
    "User acceptance testing",
    "Security audit",
    "Deployment preparation",
  ];

  const taskSamples = [
    "Setup component library",
    "Implement login flow",
    "Connect to API endpoints",
    "Setup CI/CD pipeline",
    "Create admin dashboard",
    "Optimize database queries",
    "Accessibility audit",
    "Performance testing",
    "Documentation writing",
    "Fix post-deployment bugs",
  ];

  for (const project of projects) {
    console.info(`🎯 Project: ${project.projectName}`);

    const numberOfDeliverables = Math.floor(Math.random() * 2) + 3; // 3 or 4 deliverables

    for (let i = 1; i <= numberOfDeliverables; i++) {
      const isLate = Math.random() < 0.4;
      const endDate = isLate
        ? randomDate(new Date("2024-10-01"), new Date("2025-06-15"))
        : randomDate(new Date("2025-07-01"), new Date("2025-12-31"));

      const theme =
        deliverableThemes[Math.floor(Math.random() * deliverableThemes.length)];

      const deliverable = new Deliverable(
        theme,
        `Deliverable: ${theme} for ${project.projectName}`,
        endDate,
        assignDeliverableStatus(endDate),
        new Date().toISOString(),
        Math.floor(Math.random() * 3),
      );
      deliverable.project = project;
      await dataSource.getRepository(Deliverable).save(deliverable);

      const numberOfTasks = Math.floor(Math.random() * 3) + 3; // 3 to 5 tasks

      for (let j = 1; j <= numberOfTasks; j++) {
        const taskName =
          taskSamples[Math.floor(Math.random() * taskSamples.length)];
        const taskStart = randomDate(
          new Date("2025-03-01"),
          new Date("2025-06-15"),
        );
        const taskEnd = randomDate(new Date(taskStart), new Date("2025-12-31"));

        const task = new Task(
          taskName,
          `Task: ${taskName}`,
          taskStart,
          taskEnd,
          assignTaskStatus(taskEnd),
        );
        task.deliverable = deliverable;
        await dataSource.getRepository(Task).save(task);
      }

      console.info(
        `Deliverable "${theme}" added with ${numberOfTasks} tasks (${
          isLate ? "LATE" : "on schedule"
        })`,
      );
    }
  }

  console.info("✅ Realistic dataset generation completed!");
  await dataSource.destroy();
}

populateRealisticTestData().catch((error) => {
  console.error("❌ Error while populating test data:", error);
  process.exit(1);
});
