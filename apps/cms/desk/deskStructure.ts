import { StructureBuilder } from 'sanity/structure';

/**
 * Custom desk structure for Clarus Vitae CMS
 * Organizes content types into logical groups for editors
 */
export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Editorial Content Group
      S.listItem()
        .title('Editorial')
        .child(
          S.list()
            .title('Editorial Content')
            .items([
              S.listItem()
                .title('Articles')
                .schemaType('article')
                .child(
                  S.documentTypeList('article')
                    .title('Articles')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                    .child((documentId) =>
                      S.document().documentId(documentId).schemaType('article')
                    )
                ),
              S.listItem()
                .title('Guides')
                .schemaType('guide')
                .child(
                  S.documentTypeList('guide')
                    .title('Guides')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
            ])
        ),

      S.divider(),

      // Articles by Category
      S.listItem()
        .title('Articles by Category')
        .child(
          S.list()
            .title('Categories')
            .items([
              S.listItem()
                .title('Longevity')
                .child(
                  S.documentList()
                    .title('Longevity Articles')
                    .filter('_type == "article" && category == "longevity"')
                ),
              S.listItem()
                .title('Wellness Trends')
                .child(
                  S.documentList()
                    .title('Wellness Trends')
                    .filter('_type == "article" && category == "wellness-trends"')
                ),
              S.listItem()
                .title('Destination Guides')
                .child(
                  S.documentList()
                    .title('Destination Guides')
                    .filter('_type == "article" && category == "destination-guide"')
                ),
              S.listItem()
                .title('Treatment Deep Dives')
                .child(
                  S.documentList()
                    .title('Treatment Deep Dives')
                    .filter('_type == "article" && category == "treatment-deep-dive"')
                ),
              S.listItem()
                .title('Expert Interviews')
                .child(
                  S.documentList()
                    .title('Expert Interviews')
                    .filter('_type == "article" && category == "expert-interview"')
                ),
              S.listItem()
                .title('Industry News')
                .child(
                  S.documentList()
                    .title('Industry News')
                    .filter('_type == "article" && category == "industry-news"')
                ),
            ])
        ),

      // Guides by Type
      S.listItem()
        .title('Guides by Type')
        .child(
          S.list()
            .title('Guide Types')
            .items([
              S.listItem()
                .title('Destination Guides')
                .child(
                  S.documentList()
                    .title('Destination Guides')
                    .filter('_type == "guide" && guideType == "destination"')
                ),
              S.listItem()
                .title('Treatment Guides')
                .child(
                  S.documentList()
                    .title('Treatment Guides')
                    .filter('_type == "guide" && guideType == "treatment"')
                ),
              S.listItem()
                .title('Focus Area Guides')
                .child(
                  S.documentList()
                    .title('Focus Area Guides')
                    .filter('_type == "guide" && guideType == "focus-area"')
                ),
              S.listItem()
                .title('Planning Guides')
                .child(
                  S.documentList()
                    .title('Planning Guides')
                    .filter('_type == "guide" && guideType == "planning"')
                ),
            ])
        ),

      S.divider(),

      // Pages
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('All Pages')
                .schemaType('page')
                .child(S.documentTypeList('page').title('All Pages')),
              S.listItem()
                .title('Legal Pages')
                .child(
                  S.documentList()
                    .title('Legal Pages')
                    .filter('_type == "page" && pageType == "legal"')
                ),
              S.listItem()
                .title('About Pages')
                .child(
                  S.documentList()
                    .title('About Pages')
                    .filter('_type == "page" && pageType == "about"')
                ),
              S.listItem()
                .title('Landing Pages')
                .child(
                  S.documentList()
                    .title('Landing Pages')
                    .filter('_type == "page" && pageType == "landing"')
                ),
            ])
        ),

      S.divider(),

      // Reference Content
      S.listItem()
        .title('Reference')
        .child(
          S.list()
            .title('Reference Content')
            .items([
              S.listItem()
                .title('FAQs')
                .schemaType('faq')
                .child(
                  S.documentTypeList('faq')
                    .title('FAQs')
                    .defaultOrdering([
                      { field: 'category', direction: 'asc' },
                      { field: 'order', direction: 'asc' },
                    ])
                ),
              S.listItem()
                .title('FAQs by Category')
                .child(
                  S.list()
                    .title('FAQ Categories')
                    .items([
                      S.listItem()
                        .title('General')
                        .child(
                          S.documentList()
                            .title('General FAQs')
                            .filter('_type == "faq" && category == "general"')
                        ),
                      S.listItem()
                        .title('Properties & Facilities')
                        .child(
                          S.documentList()
                            .title('Properties FAQs')
                            .filter('_type == "faq" && category == "properties"')
                        ),
                      S.listItem()
                        .title('Treatments & Programs')
                        .child(
                          S.documentList()
                            .title('Treatments FAQs')
                            .filter('_type == "faq" && category == "treatments"')
                        ),
                      S.listItem()
                        .title('The Clarus Index')
                        .child(
                          S.documentList()
                            .title('Clarus Index FAQs')
                            .filter('_type == "faq" && category == "index"')
                        ),
                      S.listItem()
                        .title('Privacy & Security')
                        .child(
                          S.documentList()
                            .title('Privacy FAQs')
                            .filter('_type == "faq" && category == "privacy"')
                        ),
                      S.listItem()
                        .title('Inquiries & Booking')
                        .child(
                          S.documentList()
                            .title('Booking FAQs')
                            .filter('_type == "faq" && category == "booking"')
                        ),
                    ])
                ),
              S.divider(),
              S.listItem()
                .title('Glossary')
                .schemaType('glossaryTerm')
                .child(
                  S.documentTypeList('glossaryTerm')
                    .title('Glossary')
                    .defaultOrdering([{ field: 'term', direction: 'asc' }])
                ),
              S.listItem()
                .title('Glossary by Category')
                .child(
                  S.list()
                    .title('Glossary Categories')
                    .items([
                      S.listItem()
                        .title('Longevity & Anti-aging')
                        .child(
                          S.documentList()
                            .title('Longevity Terms')
                            .filter('_type == "glossaryTerm" && category == "longevity"')
                        ),
                      S.listItem()
                        .title('Diagnostics & Testing')
                        .child(
                          S.documentList()
                            .title('Diagnostics Terms')
                            .filter('_type == "glossaryTerm" && category == "diagnostics"')
                        ),
                      S.listItem()
                        .title('Treatments & Therapies')
                        .child(
                          S.documentList()
                            .title('Treatments Terms')
                            .filter('_type == "glossaryTerm" && category == "treatments"')
                        ),
                      S.listItem()
                        .title('Wellness Practices')
                        .child(
                          S.documentList()
                            .title('Wellness Terms')
                            .filter('_type == "glossaryTerm" && category == "wellness"')
                        ),
                      S.listItem()
                        .title('Medical Terms')
                        .child(
                          S.documentList()
                            .title('Medical Terms')
                            .filter('_type == "glossaryTerm" && category == "medical"')
                        ),
                      S.listItem()
                        .title('Nutrition & Supplements')
                        .child(
                          S.documentList()
                            .title('Nutrition Terms')
                            .filter('_type == "glossaryTerm" && category == "nutrition"')
                        ),
                    ])
                ),
            ])
        ),

      S.divider(),

      // Workflow views
      S.listItem()
        .title('Workflow')
        .child(
          S.list()
            .title('Content Workflow')
            .items([
              S.listItem()
                .title('Drafts')
                .child(
                  S.documentList()
                    .title('Draft Content')
                    .filter(
                      '(_type == "article" || _type == "guide") && status == "draft"'
                    )
                ),
              S.listItem()
                .title('In Review')
                .child(
                  S.documentList()
                    .title('Content In Review')
                    .filter(
                      '(_type == "article" || _type == "guide") && status == "review"'
                    )
                ),
              S.listItem()
                .title('Published')
                .child(
                  S.documentList()
                    .title('Published Content')
                    .filter(
                      '(_type == "article" || _type == "guide") && status == "published"'
                    )
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('Archived')
                .child(
                  S.documentList()
                    .title('Archived Content')
                    .filter(
                      '(_type == "article" || _type == "guide") && status == "archived"'
                    )
                ),
            ])
        ),
    ]);
