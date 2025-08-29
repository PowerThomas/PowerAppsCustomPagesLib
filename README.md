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

| #  | Type       | Name                      | Description                                                                 |
|----|------------|---------------------------|-----------------------------------------------------------------------------|
| 1  | {object}   | executionContext          | The event context from which this function is executed. For a command bar button: on forms this is **PrimaryControl**, on views/subgrids this is **SelectedControl**. |
| 2  | {number}   | sourceType                | The type of source from where the Page is opened. `1 = form`, `2 = view/subgrid`. |
| 3  | {string}   | pageTitle                 | The title of the Page to open.                                              |
| 4  | {string}   | pageType                  | The type of Page, e.g. `"custom"`.                                          |
| 5  | {string}   | pageLogicalName           | The logical name of the Page to open.                                       |
| 6  | {string}   | entityLogicalName         | The logical name of the entity from which the page is opened.               |
| 7  | {number}   | target                    | How to open the Page. `1 = full page`, `2 = dialog`.                        |
| 8  | {number}   | position                  | If the target is set to `2`, this defines the type of dialog. `1 = centered`, `2 = sidepane`. |
| 9  | {number}   | widthValue                | The width of the page.                                                      |
| 10 | {number}   | heightValue               | The height of the page.                                                     |
| 11 | {string}   | widthUnit                 | The unit used to determine the width, e.g. `"px"` or `"%"`.                 |
| 12 | {string}   | heightUnit                | The unit used to determine the height, e.g. `"px"` or `"%"`.                |
| 13 | {boolean}  | refreshOnClose            | Whether to refresh the **current context** once the Page is closed (successfully). On forms: refresh form + ribbon. On views/subgrids: refresh grid (if supported). |
| 14 | {boolean}  | navigateToOverviewOnClose | If true, it navigates to the overview of the current entity once the Page is closed (successfully). |

---

## Fetching the `recordId` inside your Custom Page
When you open a custom page via **OpenPage**, the `recordId` (and other context parameters) are passed as query string parameters.

Inside your custom page, retrieve them using the **Param()** function:

```powerfx
// Retrieve the recordId and entity logical name
Set(varRecordId, Param("recordId"));
Set(varEntityName, Param("entityName"));

// Example: use recordId to load a row
// Replace 'your_table' and 'your_tableid' with your actual Dataverse logical names
EditForm(Form1);
Form1.Item = LookUp([@your_table], your_tableid = GUID(varRecordId));
````

### Available Params

* `recordId` → The GUID of the record (if opened from a form or subgrid).
* `entityName` → Logical name of the entity.
* `name` → Logical name of the custom page.
* Any other values provided via `pageInput` in JavaScript.

> 💡 **Tip:** Wrap `Param("recordId")` in `GUID()` when using it in Dataverse lookups or Patch calls:
>
> ```powerfx
> GUID(Param("recordId"))
> ```

---

## Notes

* Ensure **`sourceType` is numeric** (`1` or `2`) in the Command Designer.
* On forms, `trySave` is executed to persist changes and surface validation messages before navigating.
* On views/subgrids, the selected record is resolved from `SelectedControl → Grid → SelectedRows → Row → Data → Entity → Id`.