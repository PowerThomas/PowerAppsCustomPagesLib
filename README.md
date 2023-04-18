# Power Apps Custom Pages JS Library - PowerThomas
JS library of useful functions to use within Power Apps Model-driven Apps and Custom Pages. Currently

## Install & import
1. Download the JS file
2. Open the file in any preferred IDE and replace the `PowerThomas` namespace with your own (on top and at bottom)
2. Add it as a JavaScript Web Resource in your Power Platform solution

## Functions
### OpenPage
Opens a Page.
#### Params
Use them is this order:
|Type|Name|Description|
|---|---|---|
|{object}|executionContext|The event context from which this function is executed. If this function get triggered from a command bar button, then this is 'PrimayControl'.|
|{number}|sourceType|The type of source from where the Page is opened. 1 = form, 2 = view|
|{string}|pageTitle|The title of the Page to open.|
|{string}|pageType|The type of Page, e.g. "custom".|
|{string}|pageLogicalName|The logical name of the Page to open.|
|{string}|entityLogicalName|The logical name of the entity from which the page is opened.|
|{number}|target|How to open the Page. 1 = full page, 2 = dialog|
|{number}|position|If the target is set to 2, this defines the type of dialog. 1 = centered, 2 = sidepane.|
|{number}|widthValue|The width of the page.|
|{number}|heightValue|The height of the height.|
|{string}|widthUnit|The unit used to determine the width, e.g. "px" or "%".|
|{string}|heightUnit|The unit used to determine the height, e.g. "px" or "%".|
|{boolean}|refreshFormOnClose|Whether to refresh the form once the Page is closed (successfully).|
|{boolean}|navigateToOverviewOnClose|If true, it navigates to the overview of the current entity once the Page is closed (successfully).|
