// Note:
// Replace the PowerThomas namespace with your own.

var PowerThomas = PowerThomas || {};
(function () {
  "use strict";

  // If true, various messages are logged in the console.
  const debug = true;

  const logIndentation = "   ";

  // The line used in logs.
  const logLine = "--------------------------------------------------";

  /**
   * This function checks if the form is valid and if there are changes.
   * If it is NOT valid or there are changes, the form will be saved.
   * As it is not valid, the error notifications will be created.
   * True is returned if the form was saved successfully, false otherwise.
   *
   * @param {object} executionContext The Power Platform execution context (PrimaryControl on forms).
   */
  async function trySave(executionContext) {
    const isValid = executionContext?.data?.isValid?.();
    const isDirty = executionContext?.data?.getIsDirty?.();

    // Save the current form
    if (!isValid || isDirty) {
      Xrm.Utility.showProgressIndicator("Loading...");

      if (!isValid)
        console.debug(`Calling "save" as the record is invalid. This will create all notifications.`);
      else if (isDirty)
        console.debug(`Calling "save" as the record is valid, but changed.`);

      try {
        await executionContext.data.save();
      }
      catch (ex) {
        return false;
      }
      finally {
        Xrm.Utility.closeProgressIndicator();
      }
    }
    else
      console.debug(`No need to save. Everything is up to date.`);

    return true;
  }
  this.TrySave = trySave;

  /**
   * Removes the curly brackets from the usually passed row ID.
   *
   * @param {string} id The entity ID.
   * @returns {string} The id as an actual guid (uppercase, no braces).
   */
  function cleanID(id) {
    return id ? String(id).replace(/[{}]/g, "").toUpperCase() : null;
  }
  this.CleanID = cleanID;

  /**
   * Resolve the first selected record id based on context and sourceType.
   * Returns a clean GUID (without braces) or null.
   *
   * @param {object} ctx       PrimaryControl (form) or SelectedControl (view/subgrid)
   * @param {number} sourceType 1 = form, 2 = view/subgrid (must be numeric)
   */
  function resolveRecordIdFromContext(ctx, sourceType) {
    // Form context (PrimaryControl)
    if (sourceType === 1) {
      const rawId = ctx?.data?.entity?.getId?.();
      return cleanID(rawId);
    }

    // View/Subgrid context (SelectedControl is usually a GridControl)
    if (sourceType === 2) {
      const grid = (typeof ctx?.getGrid === "function") ? ctx.getGrid() : ctx;
      const rows = grid?.getSelectedRows?.();
      if (!rows) return null;

      const row = rows.get ? rows.get(0) : rows.getAll?.()[0];
      if (!row) return null;

      // Prefer modern shape; fall back to legacy methods for back-compat
      const data   = row?.data ?? row?.getData?.();
      const entity = data?.entity ?? data?.getEntity?.();
      const rawId  = entity?.getId?.() ?? entity?.Id ?? entity?.id ?? null;

      return cleanID(rawId);
    }

    return null;
  }
  this.ResolveRecordIdFromContext = resolveRecordIdFromContext;

  /**
   * Opens a Page.
   *
   * @param {object} executionContext The event context from which this function is executed.
   *        For a command bar button: on forms this is **PrimaryControl**; on views/subgrids this is **SelectedControl**.
   * @param {number} sourceType The type of source from where the Page is opened. 1 = form, 2 = view/subgrid
   * @param {string} pageTitle The title of the Page to open.
   * @param {string} pageType The type of Page, e.g. "custom".
   * @param {string} pageLogicalName The logical name of the Page to open.
   * @param {string} entityLogicalName The logical name of the entity from which the page is opened.
   * @param {number} target How to open the Page. 1 = full page, 2 = dialog
   * @param {number} position If the target is set to 2, this defines the type of dialog. 1 = centered, 2 = sidepane.
   * @param {number} widthValue The width of the page.
   * @param {number} heightValue The height of the page.
   * @param {string} widthUnit The unit used to determine the width, e.g. "px" or "%".
   * @param {string} heightUnit The unit used to determine the height, e.g. "px" or "%".
   * @param {boolean} refreshOnClose Whether to refresh the current context once the Page is closed (successfully).
   *                                 On forms: refresh form + ribbon. On views/subgrids: refresh grid (if supported).
   * @param {boolean} navigateToOverviewOnClose If true, navigates to the overview of the current entity once the Page is closed (successfully).
   */
  async function openPage(
    executionContext, sourceType, pageTitle, pageType, pageLogicalName,
    entityLogicalName, target, position, widthValue, heightValue,
    widthUnit, heightUnit, refreshOnClose, navigateToOverviewOnClose
  ) {
    log("openPage", arguments);

    try {
      // Only save when coming from a FORM (PrimaryControl).
      if (sourceType === 1 && executionContext) {
        if (!await trySave(executionContext)) return;
      }

      // Determine recordId based on source type
      const recordID = resolveRecordIdFromContext(executionContext, sourceType);

      // Gather input for navigation
      let pageInput = {
        pageType: pageType,
        name: pageLogicalName,
        entityName: entityLogicalName,
        recordId: recordID
      };
      let navigationOptions = {
        target: target,
        position: position,
        width: { value: widthValue, unit: widthUnit },
        height: { value: heightValue, unit: heightUnit },
        title: pageTitle
      };

      // Navigate to that page - this awaits until the page is closed.
      await Xrm.Navigation.navigateTo(pageInput, navigationOptions);

      // Show this indicator again, as the page was just closed.
      Xrm.Utility.showProgressIndicator("Loading...");

      // After closing: refresh current context or navigate to overview
      if (refreshOnClose) {
        if (sourceType === 1 && executionContext?.data) {
          // Form context: refresh data and ribbon
          await executionContext.data.refresh();
          await executionContext.ui?.refreshRibbon?.(true);
        } else if (sourceType === 2) {
          // Grid/Subgrid context: refresh grid if supported
          const grid = (typeof executionContext?.getGrid === "function")
            ? executionContext.getGrid()
            : executionContext;
          if (typeof grid?.refresh === "function") {
            await grid.refresh();
          }
        }
      } else if (navigateToOverviewOnClose) {
        console.log("Navigating to overview...");
        pageInput = {
          pageType: "entitylist",
          entityName: entityLogicalName
        };
        await Xrm.Navigation.navigateTo(pageInput);
      }
    }
    catch (ex) {
      console.error(`An error occurred while opening a page. Details:`);
      console.error(ex);
    }
    finally {
      Xrm.Utility.closeProgressIndicator();
    }
  }
  this.OpenPage = openPage;

  /**
   * Logs a title, plus a line for each key-value pair found in the values.
   *
   * @param {string} title The title for the log.
   * @param {object} values A key-value pair array. This includes be JSON. You can also pass an array.
   */
  function log(title, value) {
    if (!debug)
      return;

    console.log(logLine);
    console.log(title);

    if (Array.isArray(value)) {
      if (value.length == 0)
        console.log("[]");
      else
        logArray(value);
    }
    else if (typeof value === 'object') {
      if (value === null)
        console.log("null");
      else
        logObject(value);
    }
    else
      console.log(value);

    console.log(logLine);
  }
  this.Log = log;

  /**
   * Logs an array.
   *
   * @param {array} array The array to log.
   */
  function logArray(array) {
    if (!debug)
      return;

    for (let i = 0; i < array.length; i++)
      console.log(i, array[i]);
  }

  /**
   * Logs an object.
   *
   * @param {object} obj The object to log.
   */
  function logObject(obj) {
    if (!debug)
      return;

    Object.keys(obj).forEach(key => console.log(key + ": " + obj[key]));
  }

}).call(PowerThomas);