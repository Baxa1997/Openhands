# Notion Integration for Bug Tracking

The Notion integration enables Ucode AI to automatically read bugs from your Notion database and fix them as a software engineer would.

## Setup

### 1. Create a Notion Integration

1. Go to https://notion.so/my-integrations
2. Click **"+ New integration"**
3. Give it a name (e.g., "Ucode AI Bug Tracker")
4. Select your workspace
5. Click **"Submit"**
6. Copy the **Internal Integration Token** (starts with `secret_`)

### 2. Create a Bug Database

Create a Notion database with the following properties:

| Property Name | Type | Required | Description |
|--------------|------|----------|-------------|
| **Title** | Title | ✅ Yes | Bug title/summary |
| **Description** | Text/Rich Text | ❌ Optional | Detailed bug description |
| **Status** | Status or Select | ✅ Yes | Bug status (Todo, In Progress, Done, etc.) |
| **Priority** | Select | ❌ Optional | Bug priority (High, Medium, Low) |

**Example Database Structure:**
```
┌─────────────────────┬──────────────────────┬────────────┬──────────┐
│ Title               │ Description          │ Status     │ Priority │
├─────────────────────┼──────────────────────┼────────────┼──────────┤
│ Login button broken │ Button doesn't click │ Todo       │ High     │
│ Typo in header      │ "Welcom" should be   │ Todo       │ Low      │
│                     │  "Welcome"           │            │          │
└─────────────────────┴──────────────────────┴────────────┴──────────┘
```

### 3. Share Database with Integration

1. Open your bug database in Notion
2. Click the **"..."** menu (top right)
3. Click **"Connections"** → **"Connect to"**
4. Select your integration
5. Copy the **Database ID** from the URL:
   ```
   https://notion.so/workspace/[DATABASE_ID]?v=...
                             ^^^^^^^^^^^^^^^^
                             Copy this part
   ```

### 4. Configure in Ucode AI

1. Go to **Integrations** page in Ucode AI
2. Expand the **Notion** card
3. Paste your **Integration Token**
4. Paste your **Database ID**
5. Click **"Save Changes"**

## Usage

### Starting a Bug-Fixing Session

Once configured, you can give the AI agent natural language commands:

**Example Commands:**

```
"List bugs from Notion and fix them"
```

```
"Show me all Todo bugs in Notion"
```

```
"Fix the bug with title 'Login button broken'"
```

```
"Read bugs from Notion with High priority and fix them one by one"
```

### How the Agent Works

1. **Lists Bugs**: The agent calls `notion_list_bugs` to fetch bugs with status "Todo"
2. **Reads Details**: For each bug, it reads the title and description
3. **Updates Status**: Before starting work, it updates the status to "In Progress"
4. **Fixes Bug**: The agent analyzes the codebase and implements a fix
5. **Marks Complete**: After verifying the fix works, it updates status to "Done"
6. **Adds Comments**: Optionally adds comments to the Notion page explaining the fix

### Automated Workflow Example

```
User: "Fix all Todo bugs from Notion"

Agent:
1. Lists bugs: Found 3 bugs with status "Todo"
2. Processes Bug #1: "Login button broken"
   - Updates status to "In Progress"
   - Reads relevant code files
   - Identifies the issue
   - Implements fix
   - Runs tests
   - Updates status to "Done"
   - Adds comment: "Fixed: Added missing onClick handler"
3. Repeats for remaining bugs...
```

## Agent Tools

The agent has access to these Notion tools:

### `notion_list_bugs`
Lists bugs from your database with optional filtering.

**Parameters:**
- `status_filter` (optional): Filter by status (e.g., "Todo", "In Progress")
- `limit` (optional): Max number of bugs to return (default: 10)

**Example:**
```python
# Agent internally calls:
notion_list_bugs(status_filter="Todo", limit=5)
```

### `notion_get_bug`
Gets detailed information about a specific bug.

**Parameters:**
- `page_id` (required): The Notion page ID

### `notion_update_bug_status`
Updates the status of a bug.

**Parameters:**
- `page_id` (required): The Notion page ID
- `status` (required): New status value (e.g., "Done", "In Progress")

### `notion_add_comment`
Adds a comment to a bug page.

**Parameters:**
- `page_id` (required): The Notion page ID
- `comment` (required): Comment text

## Best Practices

### Database Organization

1. **Use Consistent Status Values**: Stick to standard values like:
   - `Todo` - Not started
   - `In Progress` - Being worked on
   - `Done` - Completed
   - `Blocked` - Cannot proceed

2. **Provide Clear Descriptions**: The more detail in the Description field, the better the agent can understand and fix the bug.

3. **Use Priority**: Add a Priority property to help the agent tackle critical bugs first.

### Task Instructions

Be specific when giving the agent tasks:

✅ **Good:**
```
"List bugs from Notion with status Todo and Priority High, then fix them"
```

❌ **Too Vague:**
```
"Fix stuff in Notion"
```

✅ **Good:**
```
"Read the bug titled 'Login form validation error' from Notion and fix it"
```

❌ **Too General:**
```
"Fix bugs"
```

## Troubleshooting

### "Not Connected" Status

**Problem**: Notion shows as "Not Connected" in Integrations page

**Solutions**:
1. Verify the Integration Token starts with `secret_`
2. Check that the Database ID is correct (32-character hex string)
3. Ensure the database is shared with your integration
4. Click "Save Changes" after entering credentials

### "Failed to query Notion database"

**Problem**: Agent reports error when trying to list bugs

**Solutions**:
1. Verify the database is shared with your integration:
   - Open database → "..." menu → "Connections"
   - Your integration should be listed
2. Check that your Database ID is correct
3. Verify your Integration Token is valid (not revoked)

### Agent doesn't find bugs

**Problem**: Agent says "No bugs found" but you have bugs in Notion

**Solutions**:
1. Check the Status property name (should be "Status" or "status")
2. Verify bugs have Status="Todo" (exact match, case-sensitive)
3. Try listing without status filter first: "List all bugs from Notion"

### Database properties not recognized

**Problem**: Agent doesn't see Description or Priority

**Solutions**:
1. Supported property names (case-insensitive):
   - **Title**: Any property of type "Title"
   - **Description**: "Description" or "description" (Text/Rich Text)
   - **Status**: "Status" or "status" (Status or Select type)
   - **Priority**: "Priority" or "priority" (Select type)
2. Rename your properties to match these names

## Security & Privacy

- **Integration Token**: Stored securely in your settings (encrypted at rest)
- **Database Access**: The integration only has access to databases you explicitly share
- **Read/Write Permissions**: The agent can read bug details and update Status/Comments
- **No Data Export**: Bug data is only used during the conversation, not stored permanently

## API Reference

For developers who want to use the NotionService directly:

```python
from openhands.integrations.notion import NotionService

# Initialize service
service = NotionService(
    api_key="secret_xxxxx",
    database_id="your-database-id"
)

# List bugs
bugs = service.list_bugs(status_filter="Todo", limit=10)

# Get specific bug
bug = service.get_bug(page_id="page-id")

# Update status
service.update_bug_status(page_id="page-id", status="Done")

# Add comment
service.add_comment(page_id="page-id", comment="Fixed the issue!")
```

## Support

For issues or questions:
1. Check this documentation
2. Review the Setup Instructions in the Integrations page
3. Check agent logs for error messages
4. Verify your Notion integration settings at notion.so/my-integrations
