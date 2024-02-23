# Power Apps Custom Pages JS Library - PowerThomas
JS library of useful functions to use within Power Apps Model-driven Apps and Custom Pages. Currently one function is documented below. More to come.

## Install & import
1. Download the JS file
2. Open the file in any preferred IDE and replace the `PowerThomas` namespace with your own (on top and at bottom)
2. Add it as a JavaScript Web Resource in your Power Platform solution

## Function
### OpenPage
Opens a Page.
#### Params
Use them is this order:
Parameter|Type|Name|Description|
|---|---|---|---|
|1|{object}|executionContext|The event context from which this function is executed. If this function is triggered from a command bar button, then this is 'PrimayControl'.|
|2|{number}|sourceType|The type of source from where the Page is opened. 1 = form, 2 = view|
|3|{string}|pageTitle|The title of the Page to open.|
|4|{string}|pageType|The type of Page, e.g. "custom".|
|5|{string}|pageLogicalName|The logical name of the Page to open.|
|6|{string}|entityLogicalName|The logical name of the entity from which the page is opened.|
|7|{number}|target|How to open the Page. 1 = full page, 2 = dialog|
|8|{number}|position|If the target is set to 2, this defines the type of dialog. 1 = centered, 2 = sidepane.|
|9|{number}|widthValue|The width of the page.|
|10|{number}|heightValue|The height of the page.|
|11|{string}|widthUnit|The unit used to determine the width, e.g. "px" or "%".|
|12|{string}|heightUnit|The unit used to determine the height, e.g. "px" or "%".|
|13|{boolean}|refreshFormOnClose|Whether to refresh the form once the Page is closed (successfully).|
|14|{boolean}|navigateToOverviewOnClose|If true, it navigates to the overview of the current entity once the Page is closed (successfully).|
