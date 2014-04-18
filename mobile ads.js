function main() {
  
  //set the following variables to customize the script to your account 
  
  var IMPRESSIONS_THRESHOLD = 100;       // min. impressions an ad needs to have to be considered
  var DATE_RANGE = "LAST_30_DAYS";       // time frame for impression threshold 
  var ADGROUP_NAME_CONTAINS = 'brand';   // word or phrase that eligible adgroup name must contain
  
  var DESC_LINE_1 = "Free Shipping and Free Returns!";   // description line 1 (end with punctuation)
  var CTA_CONTROL = "Shop Latest MIA Styles Today";      // a historically succesful CTA for line 2
  var CTA_MOBILE = "Call Now To Place Your Order";       // new mobilized CTA to test for line 2
      
  // select adgroups that meet criteria defined above
  
  var adGroupSelector = AdWordsApp
  .adGroups()
  .withCondition("Status = ENABLED")
  .withCondition("CampaignName CONTAINS_IGNORE_CASE " + "'" + ADGROUP_NAME_CONTAINS + "'")
  
  var adGroupIterator = adGroupSelector.get(); 
  
  // iterate through all selected adgroups
  
  while (adGroupIterator.hasNext()) {
     
    var adGroup = adGroupIterator.next();
    
    var headline;
    var displayURL;
    var destURL;
    var optArgs = {
        isMobilePreferred: true
    };
    
    // select enabled ads that meet predifined criteria
    // ad with best ctr for each group will be copied
    
    var adSelector = adGroup.ads()
    .forDateRange(DATE_RANGE)
    .withCondition("Status = ENABLED")
    .withCondition("Impressions > " + IMPRESSIONS_THRESHOLD)
    .orderBy("Ctr DESC");    
    
    // this iterator does not really iterate, instead
    // it orders by CTR and selects ad with highest CTR
    
    var adIterator = adSelector.get();  
    while (adIterator.hasNext()) {
      var ad = adIterator.next();
      var stats= ad.getStatsFor(DATE_RANGE); 
      
      // headline and URLS are selected from ad
      
      headline = ad.getHeadline();     
      displayUrl = ad.getDisplayUrl();
      destinationUrl = ad.getDestinationUrl();
      Logger.log(headline +": " + stats.getCtr())
      break;     
    }
    
    // and are copied along with pre-defined description line
    // to create to versions of the mobile-prefered ad
    
    adGroup.createTextAd(
      headline,
      DESC_LINE_1,
      CTA_CONTROL,
      displayUrl,
      destinationUrl,
      optArgs
    )
  
    adGroup.createTextAd(
      headline,
      DESC_LINE_1,
      CTA_MOBILE,
      displayUrl,
      destinationUrl,
      optArgs
    )
  }
}