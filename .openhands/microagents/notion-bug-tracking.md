---
name: notion-bug-tracking
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
- notion
- notion task
- notion bug
- bug tracking
- mark as done
- update notion
---

# Notion Bug Tracking Integration

When working with Notion bug tracking tasks, follow these guidelines:

## Understanding Context

When a user selects a Notion task through the bug selector, you will receive a message containing:
- The task title
- The task description
- A request to fix the issue

## Workflow for Fixing Notion Bugs

1. **Analyze the Bug**: Carefully read the bug title and description to understand the issue
2. **Locate Relevant Code**: Search the workspace for files related to the bug
3. **Implement Fix**: Make the necessary code changes to resolve the issue
4. **Test the Fix**: Run appropriate tests to verify the fix works
5. **Update Notion Status**: After successful completion, suggest updating the task status

## Updating Notion Task Status

When you have successfully fixed a bug and verified it works, you should inform the user that the task can be marked as complete in Notion. The user can manually update the status through the Notion integration, or you can suggest they update it.

**Example completion message:**
```
I have successfully fixed the issue described in the Notion task "[Task Title]".

Changes made:
- [List of changes]

The fix has been verified by [testing method used].

You can now mark this task as "Done" in Notion to update its status.
```

## API Endpoints Available

The system has these Notion API endpoints that can be used:

- `GET /api/notion/tasks` - List tasks from Notion database
- `POST /api/notion/update-status` - Update task status (requires page_id, status, and optional status_property_name)
- `GET /api/notion/test-connection` - Test Notion API connection

## Status Values

Common Notion status values to use:
- **To Do** - Task not started
- **In Progress** - Task being worked on
- **Done** - Task completed
- **Bug** - Issue identified as a bug

## Best Practices

1. **Verify fixes thoroughly** before suggesting the task be marked complete
2. **Document changes clearly** so the user knows what was modified
3. **Run tests** whenever possible to validate the fix
4. **Be specific** about what code was changed and why
5. **Communicate status** to help users track progress

## Error Handling

If you encounter issues while fixing a bug:
1. Explain what prevented completion
2. Suggest alternative approaches
3. Ask for clarification if the bug description is unclear
4. Do NOT mark as done if the fix is incomplete
