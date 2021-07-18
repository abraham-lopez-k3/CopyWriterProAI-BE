const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const generator = require('../services/contents');
const { userService } = require('../services');

const generate = catchAsync(async (req, res) => {
  if (req.user.credits === 0) {
    res.status(httpStatus.PAYMENT_REQUIRED).send({ message: 'Upgrade our friendship today!' });
  } else {
    const { task } = req.body;
    let generatedContent;

    if (task === 'paraphrasing') {
      generatedContent = await generator.writing.paraphrase(req.user._id, req.body);
    } else if (task === 'blog-outline') {
      generatedContent = await generator.writing.blogOutline(req.user._id, req.body);
    } else if (task === 'blog-idea') {
      generatedContent = await generator.writing.blogIdea(req.user._id, req.body);
    } else if (task === 'blog-headline') {
      generatedContent = await generator.writing.blogHeadline(req.user._id, req.body);
    } else if (task === 'blog-intro') {
      generatedContent = await generator.writing.blogIntro(req.user._id, req.body);
    } else if (task === 'product-description') {
      generatedContent = await generator.product.productDescription(req.user._id, req.body);
    } else if (task === 'seo-friendly-product-description') {
      generatedContent = await generator.product.makeProductDescriptionSEOFriendly(req.user._id, req.body);
    } else if (task === 'product-review') {
      generatedContent = await generator.product.productReview(req.user._id, req.body);
    } else if (task === 'catchy-headline') {
      generatedContent = await generator.headline.catchyHeadline(req.user._id, req.body);
    } else if (task === 'attention-grabbing-headline') {
      generatedContent = await generator.headline.attentionGrabbingHeadline(req.user._id, req.body);
    } else if (task === 'newspaper-headline') {
      generatedContent = await generator.headline.newspaperHeadline(req.user._id, req.body);
    } else if (task === 'resume-headline') {
      generatedContent = await generator.headline.resumeHeadline(req.user._id, req.body);
    } else if (task === 'campaign-facebook-post') {
      generatedContent = await generator.facebook.campaignPostFromBusinessType(req.user._id, task, req.body);
    } else if (task === 'ads-facebook-primary-texts') {
      generatedContent = await generator.facebook.facebookAdPrimaryTexts(req.user._id, req.body);
    } else if (task === 'ads-facebook-headlines') {
      generatedContent = await generator.facebook.facebookAdHeadlines(req.user._id, req.body);
    } else if (task === 'ads-facebook-link-descriptions') {
      generatedContent = await generator.facebook.facebookAdLinkDescription(req.user._id, req.body);
    } else if (task === 'facebook-ads-from-product-description') {
      generatedContent = await generator.facebook.facebookAdsFromProductDescription(req.user._id, req.body);
    } else if (task === 'instagram-ad-texts') {
      generatedContent = await generator.instagram.instagramAdTexts(req.user._id, req.body);
    } else if (task === 'linkedin-ad-texts') {
      generatedContent = await generator.linkedIn.linkedinAdTexts(req.user._id, req.body);
    } else if (task === 'ads-google-headlines') {
      generatedContent = await generator.google.googleAdHeadlines(req.user._id, req.body);
    } else if (task === 'ads-google-descriptions') {
      generatedContent = await generator.google.googleAdDescriptions(req.user._id, req.body);
    } else if (task === 'youtube-video-titles-from-description') {
      generatedContent = await generator.youtube.youtubeVideoTitleFromDescription(req.user._id, req.body);
    } else if (task === 'youtube-video-ideas') {
      generatedContent = await generator.youtube.youtubeVideoIdeas(req.user._id, req.body);
    } else if (task === 'image-idea-from-ad-text') {
      generatedContent = await generator.commonTask.imageIdeasFromAdText(req.user._id, req.body);
    } else if (task === 'email-marketing-campaign-subject') {
      generatedContent = await generator.email.emailMarketingCampaignSubject(req.user._id, req.body);
    } else if (task === 'email-marketing-campaign-body') {
      generatedContent = await generator.email.emailMarketingCampaignBody(req.user._id, req.body);
    } else if (task === 'email-body') {
      generatedContent = await generator.email.emailBody(req.user._id, req.body);
    } else if (task === 'website-short-description') {
      generatedContent = await generator.website.generateWebsiteShortDescription(req.user._id, req.body);
    } else if (task === 'website-keywords-from-text') {
      generatedContent = await generator.website.generateKeywordsFromText(req.user._id, req.body);
    } else if (task === 'youtube-video-tags-from-description') {
      generatedContent = await generator.youtube.generateVideoTagsFromDescription(req.user._id, req.body);
    } else if (task === 'youtube-channel-tags-from-description') {
      generatedContent = await generator.youtube.generateChannelTagsFromDescription(req.user._id, req.body);
    } else if (task === 'website-seo-friendly-blog-ideas') {
      generatedContent = await generator.website.generateSEOFriendlyBlogIdeas(req.user._id, req.body);
    } else if (task === 'website-landing-page-headline') {
      generatedContent = await generator.website.generateLandingPageHeadline(req.user._id, req.body);
    } else if (task === 'product-name') {
      generatedContent = await generator.product.generateProductName(req.user._id, req.body);
    } else if (task === 'linkedin-summary') {
      generatedContent = await generator.linkedIn.generateLinkedInSummary(req.user._id, req.body);
    } else if (task === 'catchy-business-taglines') {
      generatedContent = await generator.business.generateCatchyBusinessTaglines(req.user._id, req.body);
    } else if (task === 'fiverr-categories-headline') {
      generatedContent = await generator.fiverr.generateFiverrCategoriesHeadline(req.user._id, req.body);
    } else if (task === 'cv-summary') {
      generatedContent = await generator.cv.generateCVSummary(req.user._id, req.body);
    } else if (task === 'amazon-product-listings') {
      generatedContent = await generator.amazon.generateAmazonProductListings(req.user._id, req.body);
    } else if (task === 'problem-agitate-solution') {
      generatedContent = await generator.sales.problemAgitateSolution(req.user._id, req.body);
    } else if (task === 'problem-agitate-solution-outcome') {
      generatedContent = await generator.sales.problemAgitateSolutionOutcome(req.user._id, req.body);
    } else if (task === 'attention-interest-desire-action') {
      generatedContent = await generator.sales.attentionInterestDesireAction(req.user._id, req.body);
    } else if (task === 'generate-recipe') {
      generatedContent = await generator.recipe.generateRecipe(req.user._id, req.body);
    }

    userService.updateUserById(req.user, req.user._id, { credits: req.user.credits - 1 });
    res.status(httpStatus.OK).send(generatedContent);
  }
});

module.exports = {
  generate,
};
