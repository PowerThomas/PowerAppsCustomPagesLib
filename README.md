# Power Apps Custom Pages JS Library - PowerThomas
JS library of useful functions to use within Power Apps Model-driven Apps and Custom Pages. Currently one function is documented below. More to come.

## Install & import
1. Download the JS file  
2. Open the file in any preferred IDE and replace the `PowerThomas` namespace with your own (on top and at bottom)  
3. Add it as a JavaScript Web Resource in your Power Platform solution  

## Function
### OpenPage
Opens a Page.

#### Params
Use them in this order:

| #  | Type       | Name                     | Description                                                                 |
|----|------------|--------------------------|-----------------------------------------------------------------------------|
| 1  | {object}   | executionContext         | The event context from which this function is executed. For a command bar button: on forms this is **PrimaryControl**, on views/subgrids this is **SelectedControl**. |
| 2  | {number}   | sourceType               | The type of source from where the Page is opened. `1 = form`, `2 = view/subgrid`. |
| 3  | {string}   | pageTitle                | The title of the Page to open.                                              |
| 4  | {string}   | pageType                 | The type of Page, e.g. `"custom"`.                                          |
| 5  | {string}   | pageLogicalName          | The logical name of the Page to open.                                       |
| 6  | {string}   | entityLogicalName        | The logical name of the entity from which the page is opened.               |
| 7  | {number}   | target                   | How to open the Page. `1 = full page`, `2 = dialog`.                        |
| 8  | {number}   | position                 | If the target is set to `2`, this defines the type of dialog. `1 = centered`, `2 = sidepane`. |
| 9  | {number}   | widthValue               | The width of the page.                                                      |
| 10 | {number}   | heightValue              | The height of the page.                                                     |
| 11 | {string}   | widthUnit                | The unit used to determine the width, e.g. `"px"` or `"%"`.                 |
| 12 | {string}   | heightUnit               | The unit used to determine the height, e.g. `"px"` or `"%"`.                |
| 13 | {boolean}  | refreshFormOnClose       | Whether to refresh the form once the Page is closed (successfully).         |
| 14 | {boolean}  | navigateToOverviewOnClose| If true, it navigates to the overview of the current entity once the Page is closed (successfully). |

---

## Fetching the `recordId` inside your Custom Page
When you open a custom page from the **OpenPage** function, the `recordId` (and other context parameters) are passed automatically as query string parameters.  

Inside the custom page you can retrieve these values using the `Param()` function:

```powerfx
// Retrieve the recordId of the context record
Set(varRecordId, Param("recordId"));

// Retrieve the entity name
Set(varEntityName, Param("entityName"));

// Use them directly, e.g. in a form
EditForm(Form1);
Form1.Item = LookUp([@YourEntity], YourEntityId = GUID(varRecordId));
````

### Available Params

* `recordId` → The GUID of the record (if opened from a form or subgrid).
* `etn` → Logical name of the entity.

ℹ️ **Tip**: Always wrap `Param("recordId")` in `GUID()` when you want to use it in a Dataverse lookup.

```powerfx
GUID(Param("recordId"))
```

---

This makes it easy to open a custom page in context of a record and fetch the same record inside the page for editing, display, or navigation logic.
