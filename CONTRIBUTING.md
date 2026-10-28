# Contributing to Wigggle UI

Thank you for your interest in contributing to Wigggle UI! We appreciate your support and look forward to your contributions. We strongly recommend that you check for open issues and pull requests to see if someone else is working on something similar.

## Getting Started

### Fork and Clone the Repository

1. **Fork this repository** Click [here](https://github.com/wigggle-ui/ui/fork) to fork the repository.

2. **Clone your forked repository to your local machine**

   ```bash
   git clone https://github.com/<YOUR_USERNAME>/wigggle-ui.git
   ```

3. **Navigate to the project directory**

   ```bash
   cd wigggle-ui
   ```

4. **Create a new branch for your changes**

   ```bash
   git checkout -b my-new-branch
   ```

5. **Install dependencies**

   ```bash
   pnpm i
   ```

6. **Create a `.env.local` file**

   ```bash
   touch .env.local && echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" > .env.local
   ```

7. **Run the project**
   ```bash
   pnpm dev
   ```

## Adding a New Widget

To add a new widget to Wigggle UI, you will need to modify several files.

Widgets are divided into categories such as `Clock`, `Weather`, `Calendar`, etc.

You would either:

- Put your new widget in an existing category or
- Create a new category for your widget.

Make sure categories follow the same naming convention.

- Category Name should be in title case and should be singular.
- Make sure categories are not duplicated. (e.g. Clock and Time)

### 1. Assign Widget to a Category

Check the category folders inside `registry/default/widgets` and create a file for your new widget. Every widget is a numbered file inside the category folder.

Widget Naming Convention: **[CATEGORY-NAME]-[WIDGET-NUMBER].tsx**

Example: **calendar-07.tsx**

### 2. Create Widget

Create the main widget in `registry/default/widgets/[CATEGORY-NAME]/[WIDGET-NUMBER].tsx`

```typescript
import React from 'react'

export default function WidgetDemo() {
  return (
    <div>
      This is your new Widget.
    </div>
  )
}
```

### 2. Update Widgets config

Add your widget to the config in `config/widgets.ts`. Make sure you add the new widget to the correct category.

If you are adding a new category, make sure you add the boolean `isNew` to the category object.

```typescript
{
    slug: "calendar",
    name: "Calendar",
    widgets: [
      { name: "calendar-01" },
      { name: "calendar-02" },
      { name: "calendar-03" },
      { name: "calendar-04" },
      { name: "calendar-05" }, // Your new widget
    ],
    isNew: true, // If you are adding a new category
},
```

### 4. Update Registry

Once you add your widget to the config, you need to add it to the registry. The registry follows the same structure and config as `shadcn/ui registry`. You can check their [docs](https://ui.shadcn.com/docs/registry/registry-item-json) to learn more.

#### Example widget entry

```json
{
    "name": "calendar-05",
    "type": "registry:component",
    "registryDependencies": [
        "https://wigggle-ui.vercel.app/r/widget.json",
        "https://wigggle-ui.vercel.app/r/badge.json",
        "https://wigggle-ui.vercel.app/r/label.json"
    ],
    "files": [
        {
            "path": "registry/default/widgets/calendar/calendar-05.tsx",
            "type": "registry:component"
        }
    ],
    "meta": {
        "tags": ["calendar"]
    }
},
```

#### Definitions

You can see the JSON Schema for `widget-number.json` [here](https://ui.shadcn.com/schema/widget-item.json).

Make sure to add any necessary dependencies, tailwind configurations, or other properties as needed for your specific component.

### 6. Build registry

```bash
pnpm build:registry
```

### 7. Local testing

Once you have added your widget to the config and the registry, test your widget on your local machine. Make sure you cover the edge cases and test the widget in different environments.

Pointers:

- Test the widget in different environments such as Next.js, React, Vue, Svelte, etc.
- Test the widget in different themes such as light, dark, and system.
- Test the widget in different screen sizes and orientations.
- Test the widget in different browsers such as Chrome, Firefox, Safari, Edge, etc.

### 8. Commit Conventions

Before you create a Pull Request, please check whether your commits comply with the commit conventions used in this repository.

When you create a commit we kindly ask you to follow the convention `category(scope or module): message` in your commit message while using one of the following categories:

- `feat / feature`: all changes that introduce completely new code or new features
- `fix`: changes that fix a bug (ideally you will additionally reference an issue if present)
- `refactor`: any code related change that is not a fix nor a feature
- `docs`: changing existing or creating new documentation (i.e. README, docs for usage of a lib or cli usage)
- `build`: all changes regarding the build of the software, changes to dependencies or the addition of new dependencies
- `chore`: all changes to the repository that do not fit into any of the above categories

  e.g. `feat(widgets): add new prop to the clock-12 widget`

If you are interested in the detailed specification you can visit https://www.conventionalcommits.org/ or check out the [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

### 9. Submit your widget

Once you are satisfied with your widget, submit it by filing a [pull request](https://github.com/wigggle-ui/ui/compare) to the main repository.

Please make sure you do the following:

- Add a descriptive title and description to your pull request.
- Provide a demo video / screenshot of your widget in action.
- Add `henilshahdev` as a reviewer.
- Add yourself as an assignee.

## Ask for Help

For any help or questions, please open a new GitHub issue or reach out to me on [Twitter](https://twitter.com/wigggleui).
